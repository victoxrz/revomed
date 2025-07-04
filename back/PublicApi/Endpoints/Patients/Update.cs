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
        string IDNP,
        string Job,
        string StreetAddress,
        string Country,
        string Phone);

    private class UpdateRequestValidator : AbstractValidator<UpdateRequest>
    {
        public UpdateRequestValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(30);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Patronymic).MaximumLength(30);
            RuleFor(x => x.Birthday).NotEmpty().GreaterThan(new DateOnly(1900, 1, 1));
            RuleFor(x => x.Gender).IsInEnum();
            RuleFor(x => x.BloodType).IsInEnum();
            RuleFor(x => x.IDNP).NotEmpty().Length(13);
            RuleFor(x => x.Job).NotEmpty().MaximumLength(30);
            RuleFor(x => x.StreetAddress).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Country).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(15);
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPut(Tag.ToLower() + "/update/{id}", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, [FromBody] UpdateRequest request, IPatientRepository repo)
    {
        var result = new UpdateRequestValidator().Validate(request);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (System.Text.Json.JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        var patient = await repo.GetByIdAsync(id);
        if (patient == null)
            return TypedResults.NotFound();

        var response = await repo.UpdateAsync(request.Adapt(patient));
        if (!response.IsSuccessful)
        {
            return TypedResults.Extensions.Error(response.Error, StatusCodes.Status400BadRequest);
        }

        return TypedResults.Ok(request);
    }
}
