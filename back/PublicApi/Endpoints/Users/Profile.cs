using Microsoft.AspNetCore.Http.HttpResults;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

// might rename it
public class Profile : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Users.ToString();
        app.MapGet(tag.ToLower() + "/profile", HandleAsync)
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithTags(tag);
    }

    public ContentHttpResult HandleAsync(HttpRequest request)
    {
        request.Headers.TryGetValue("Authorization", out var token);
        return TypedResults.Text(token);
    }
}
