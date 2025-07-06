using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Domain.Enums;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Update : BaseEndpoint
{
    private record UpdateRequest(UserRole UserRole, int TemplateId);

    private class UpdateRequestValidator : AbstractValidator<UpdateRequest>
    {
        public UpdateRequestValidator()
        {
            RuleFor(x => x.UserRole).IsInEnum();
            RuleFor(x => x.TemplateId).NotEmpty().GreaterThan(0).When(x => x.UserRole == UserRole.Medic);
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPut(Tag.ToLower() + "/update/{id}", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(UserRole.Admin)
            .WithTags(Tag);

        TypeAdapterConfig<User, User>.NewConfig().Ignore(e => e.UserRole).Compile();
    }

    private async Task<IResult> HandleAsync([FromRoute] int id, [FromBody] UpdateRequest request, IUserRepository userRepo)
    {
        var result = await new UpdateRequestValidator().ValidateAsync(request);
        if (!result.IsValid)
        {
            return TypedResults.BadRequest(result.ToDictionary());
        }

        var user = await userRepo.GetByIdAsync(id);
        if (user == null)
            return TypedResults.NotFound(new ErrorResponse("No user was found"));

        var modified = request.UserRole switch
        {
            UserRole.Patient => new User(),
            UserRole.Medic => new Medic() { TemplateId = request.TemplateId },
            _ => null,
        };

        if (modified == null)
            return TypedResults.BadRequest();

        await userRepo.UpdateAsync(user, user.Adapt(modified));

        return TypedResults.Ok(user is Medic);
    }
}
