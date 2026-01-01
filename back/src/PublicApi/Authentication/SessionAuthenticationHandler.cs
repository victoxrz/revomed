using System.Security.Claims;
using System.Text.Encodings.Web;
using AppCore.Interfaces.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace PublicApi.Authentication;

/// <summary>
/// Validates session ID from Authorization header and loads user claims from Redis
/// </summary>
public class SessionAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly ISessionStore _sessionStore;

    public SessionAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISessionStore sessionStore
    )
        : base(options, logger, encoder)
    {
        _sessionStore = sessionStore;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Check for Authorization header with session ID
        if (!Request.Headers.TryGetValue("Authorization", out var authHeader))
        {
            return AuthenticateResult.NoResult();
        }

        var sessionId = authHeader.ToString().Trim();

        if (string.IsNullOrWhiteSpace(sessionId))
        {
            return AuthenticateResult.Fail("Invalid session ID");
        }

        try
        {
            // Load session directly from Redis
            var session = await _sessionStore.GetSessionAsync(sessionId, Context.RequestAborted);

            if (session == null)
            {
                return AuthenticateResult.Fail("Session not found or expired");
            }

            // Optional: Refresh session expiration on each request (sliding expiration)
            await _sessionStore.RefreshSessionAsync(sessionId, Context.RequestAborted);

            // TODO: review this!
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, session.UserId.ToString()),
                new Claim(ClaimTypes.Email, session.Email),
                new Claim(ClaimTypes.Role, session.UserRole),
                // for OpenID Connect something
                new Claim("sub", session.Email),
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error authenticating session");
            return AuthenticateResult.Fail("Authentication error");
        }
    }
}
