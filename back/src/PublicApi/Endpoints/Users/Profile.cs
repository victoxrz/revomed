using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AppCore.Interfaces.Repository;
using Domain.Enums;
using Mapster;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Profile : BaseEndpoint
{
    public record GetResponse(string Email, UserRole UserRole, string Specialty);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/profile", HandleAsync).RequireAuthorization().WithTags(Tag);
    }

    private async Task<IResult> HandleAsync(HttpContext context, IUserRepository repo)
    {
        var email = context.User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return TypedResults.BadRequest(new ErrorResponse("Try to log in again"));

        var user = await repo.FindByEmail(email).SingleOrDefaultAsync();

        return TypedResults.Ok(user.Adapt<GetResponse>());
    }
}
