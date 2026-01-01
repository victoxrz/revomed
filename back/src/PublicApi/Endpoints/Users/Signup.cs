using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Signup : BaseEndpoint
{
    public record SignupRequest(string Email, string Password);

    public record SignupResponse(string SessionId);

    public class SignupRequestValidator : AbstractValidator<SignupRequest>
    {
        public SignupRequestValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty();
            //.MinimumLength(8)
        }
    }

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPost(Tag.ToLower() + "/signup", HandleAsync)
            .DisableAntiforgery()
            .WithValidation<SignupRequest>()
            .AllowAnonymous()
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync(
        [FromForm] SignupRequest request,
        IUserRepository repo,
        ISessionStore sessionStore,
        HttpContext httpContext,
        CancellationToken ct
    )
    {
        if (await repo.SignupAsync(request.Email, request.Password))
        {
            var user = await repo.FindByEmail(request.Email).SingleOrDefaultAsync(ct);

            if (user == null)
            {
                return TypedResults.InternalServerError(
                    new ErrorResponse("An error occurred during signup. Please try again.")
                );
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

            var sessionId = await sessionStore.CreateSessionAsync(session, ct);

            return TypedResults.Ok(new SignupResponse(sessionId));
        }
        else
        {
            return TypedResults.BadRequest(
                new ErrorResponse("The provided email is already associated with an account")
            );
        }
    }
}
