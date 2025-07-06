using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Domain.Enums;
using Mapster;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PublicApi.Endpoints.Users;

public class Profile : BaseEndpoint
{
    private record GetResponse(int? TemplateId, string Email, UserRole UserRole);
    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/profile", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);

    }

    private async Task<IResult> HandleAsync(HttpContext context, IUserRepository repo)
    {
        var email = context.User.FindFirstValue(JwtRegisteredClaimNames.Email);
        if (email == null)
            return TypedResults.BadRequest(new ErrorResponse("Try to log in again"));

        var user = await repo.FindByEmail(email).SingleOrDefaultAsync();

        return TypedResults.Ok(user.Adapt<GetResponse>());
    }
}
