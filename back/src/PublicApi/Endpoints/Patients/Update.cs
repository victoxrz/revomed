using AppCore.Interfaces.Repository;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class Update : BaseEndpoint
{
    public record UpdateRequest(
        string FirstName,
        string LastName,
        DateOnly Birthday,
        Domain.Enums.Gender Gender,
        string Patronymic,
        Domain.Enums.BloodType BloodType,
        string Idnp,
        string Job,
        string StreetAddress,
        string Country,
        string Phone,
        string InsurancePolicy);

    public class UpdateRequestValidator : AbstractValidator<UpdateRequest>
    {
        public UpdateRequestValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(30);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Patronymic).MaximumLength(30);
            RuleFor(x => x.Birthday).NotEmpty().GreaterThan(new DateOnly(1900, 1, 1));
            RuleFor(x => x.Gender).IsInEnum();
            RuleFor(x => x.BloodType).IsInEnum();
            RuleFor(x => x.Idnp).NotEmpty().Length(13);
            RuleFor(x => x.Job).NotEmpty().MaximumLength(30);
            RuleFor(x => x.StreetAddress).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Country).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(15);
            RuleFor(x => x.InsurancePolicy).NotEmpty().MaximumLength(15);
        }
    }

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPut(Tag.ToLower() + "/update/{id}", HandleAsync)
            .WithValidation<UpdateRequest>()
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromBody] UpdateRequest request, [FromRoute] int id, IPatientRepository repo)
    {
        var patient = await repo.GetByIdAsync(id);
        if (patient == null)
            return TypedResults.NotFound();

        var response = await repo.UpdateAsync(request.Adapt(patient));
        if (!response.IsSuccessful)
        {
            return TypedResults.BadRequest(new ErrorResponse(response.Error));
        }

        return TypedResults.Ok(request);
    }
}
