using AppCore.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Accounts;

public class Logout : BaseEndpoint
{
    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPost(Tag.ToLower() + "/logout", HandleAsync).RequireAuthorization().WithTags(Tag);
    }

    private async Task<IResult> HandleAsync(
        [FromHeader(Name = "Authorization")] string authorization,
        ISessionStore sessionStore
    )
    {
        // Extract session ID from Authorization header
        var sessionId = authorization?.Trim() ?? "";

        if (string.IsNullOrWhiteSpace(sessionId))
            return TypedResults.BadRequest(new ErrorResponse("Invalid session ID"));

        // Delete session from Redis
        var deleted = await sessionStore.DeleteSessionAsync(sessionId);

        if (!deleted)
            return TypedResults.NotFound(new ErrorResponse("Session not found"));

        return TypedResults.Ok();
    }
}
