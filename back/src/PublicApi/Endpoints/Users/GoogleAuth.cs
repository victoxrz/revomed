using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;
using StackExchange.Redis;

namespace PublicApi.Endpoints.Users;

public class GoogleAuth : BaseEndpoint
{
    public record GoogleAuthRequest(string IdToken);

    public record GoogleAuthResponse(string SessionId);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPost(Tag.ToLower() + "/google-auth", HandleAsync).AllowAnonymous().WithTags(Tag);
    }

    private async Task<IResult> HandleAsync(
        [FromBody] GoogleAuthRequest request,
        HttpContext httpContext,
        IUserRepository repo,
        ISessionStore sessionStore,
        IConfiguration config,
        HttpClient http,
        CancellationToken ct = default
    )
    {
        try
        {
            // 1. Validate Google ID Token
            var clientId = config["Authentication:Google:ClientId"];

            var payload = await GoogleJsonWebSignature.ValidateAsync(
                request.IdToken,
                new GoogleJsonWebSignature.ValidationSettings { Audience = [clientId] }
            );

            // 2. Extract user info from payload
            if (!payload.EmailVerified)
                return TypedResults.BadRequest(new ErrorResponse("Email not verified"));

            // 3. Find User
            var user = await repo.FindByEmail(payload.Email).SingleOrDefaultAsync();
            if (user == null)
                return TypedResults.BadRequest(new ErrorResponse("User not found. Please sign up first."));

            // 4. Create session
            var userAgent = httpContext.Request.Headers.UserAgent.ToString();
            var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            var session = new UserSession(
                user.Id,
                user.Email,
                user.UserRole.ToString(),
                userAgent,
                ipAddress,
                DateTime.UtcNow
            );

            var sessionId = await sessionStore.CreateSessionAsync(session, ct);

            return TypedResults.Ok(new GoogleAuthResponse(sessionId));
        }
        catch (InvalidJwtException)
        {
            return TypedResults.BadRequest(new ErrorResponse("Invalid Google token"));
        }
        catch (RedisConnectionException)
        {
            return TypedResults.InternalServerError(new ErrorResponse("Session store unavailable"));
        }
    }
}
