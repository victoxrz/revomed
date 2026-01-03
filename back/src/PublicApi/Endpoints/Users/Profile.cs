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
    public record GetUserResponse
    {
        public int Id { get; init; }
        public required string LastName { get; init; }
        public required string FirstName { get; init; }
        public required string Email { get; init; }
        public UserRole UserRole { get; init; }
    }

    public record GetMedicResponse : GetUserResponse
    {
        public required string Specialty { get; init; }
    };

    public record GetPatientResponse : GetUserResponse
    {
        public required string Patronymic { get; init; }
        public DateOnly Birthday { get; init; }
        public Gender Gender { get; init; }
        public required string Idnp { get; init; }
        public required string Job { get; init; }
        public required string Phone { get; init; }
        public required string StreetAddress { get; init; }
        public required string Country { get; init; }
        public BloodType BloodType { get; init; }
        public required string InsurancePolicy { get; init; }
        public bool? IsInsured { get; init; }
    };

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

        return (user?.UserRole) switch
        {
            UserRole.User or UserRole.Admin => TypedResults.Ok(user.Adapt<GetUserResponse>()),
            UserRole.Medic => TypedResults.Ok(user.Adapt<GetMedicResponse>()),
            UserRole.Patient => TypedResults.Ok(user.Adapt<GetPatientResponse>()),
            _ => TypedResults.BadRequest(new ErrorResponse("Try to log in again")),
        };
    }
}
