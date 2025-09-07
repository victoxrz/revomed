using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Domain.Enums;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Update : BaseEndpoint
{
    public record UpdateRequest(UserRole UserRole);

    private class UpdateRequestValidator : AbstractValidator<UpdateRequest>
    {
        public UpdateRequestValidator()
        {
            RuleFor(x => x.UserRole).IsInEnum();
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPut(Tag.ToLower() + "/update/{id}", HandleAsync)
            .RequireAuthorization()
            .WithValidation<UpdateRequest>()
            .RequireRoles(UserRole.Admin)
            .WithTags(Tag);

        TypeAdapterConfig<User, User>.NewConfig().Ignore(e => e.UserRole).Compile();
    }

    private async Task<IResult> HandleAsync([FromBody] UpdateRequest request, [FromRoute] int id, IUserRepository userRepo)
    {
        var user = await userRepo.GetByIdAsync(id);
        if (user == null)
            return TypedResults.NotFound(new ErrorResponse("No user was found"));

        var modified = request.UserRole switch
        {
            UserRole.Patient => new User(),
            UserRole.Medic => new Medic(),
            _ => null,
        };

        if (modified == null)
            return TypedResults.BadRequest();

        await userRepo.UpdateAsync(user, user.Adapt(modified));

        return TypedResults.Ok(user is Medic);
    }
}
