using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Mapster;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PublicApi.Endpoints.Users;

public class Profile : BaseEndpoint
{
    private record GetResponse(string Email, Domain.Enums.UserRole UserRole, int TemplateId);
    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/profile", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync(HttpContext context, IUserRepository repo)
    {
        var email = context.User.FindFirstValue(JwtRegisteredClaimNames.Email);
        if (email == null)
            return TypedResults.Extensions.Error("Try to log in again", StatusCodes.Status400BadRequest);

        var user = await repo.FindByEmail(email).Include(e => e.Medic).SingleOrDefaultAsync();
        
        return TypedResults.Ok(user.Adapt<GetResponse>());
    }
}
