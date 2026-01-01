using AppCore.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Logout : BaseEndpoint
{
    public record LogoutResponse(string Message);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPost(Tag.ToLower() + "/logout", HandleAsync).RequireAuthorization().WithTags(Tag);
    }

    private async Task<IResult> HandleAsync(
        [FromHeader(Name = "Authorization")] string authorization,
        ISessionStore sessionStore,
        CancellationToken ct = default
    )
    {
        // Extract session ID from Authorization header
        var sessionId = authorization?.Trim() ?? "";

        if (string.IsNullOrWhiteSpace(sessionId))
        {
            return TypedResults.BadRequest(new { Message = "Invalid session ID" });
        }

        // Delete session from Redis
        var deleted = await sessionStore.DeleteSessionAsync(sessionId, ct);

        if (!deleted)
        {
            return TypedResults.NotFound(new { Message = "Session not found" });
        }

        return TypedResults.Ok(new LogoutResponse("Logged out successfully"));
    }
}
