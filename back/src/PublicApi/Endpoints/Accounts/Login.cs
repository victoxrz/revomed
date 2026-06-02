using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Login : BaseEndpoint
{
    public record LoginRequest(string Email, string Password);

    public record LoginResponse(string SessionId);

    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty();
        }
    }

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPost(Tag.ToLower() + "/login", HandleAsync)
            .WithValidation<LoginRequest>()
            .DisableAntiforgery() // TODO: check next.js if it uses CSRF tokens => use FromBody instead of FromForm
            .AllowAnonymous()
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync(
        [FromForm] LoginRequest request,
        HttpContext httpContext,
        HashProvider hashProvider,
        IUserRepository repo,
        ISessionStore sessionStore
    )
    {
        var user = await repo.FindByEmail(request.Email).SingleOrDefaultAsync();

        if (user == null || !hashProvider.Verify(request.Password, user.Password))
        {
            return TypedResults.Unauthorized();
        }

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

        var sessionId = await sessionStore.CreateSessionAsync(session);

        return TypedResults.Ok(new LoginResponse(sessionId));
    }
}
