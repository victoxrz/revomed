using AppCore.Interfaces.Repository;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using System.Text.Json;

namespace PublicApi.Endpoints.Patients;

public sealed class Update : IEndpoint
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

    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Patients.ToString();
        app.MapPut(tag.ToLower() + "/update/{id}", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, [FromBody] UpdateRequest request, IPatientRepository repo)
    {
        var result = new UpdateRequestValidator().Validate(request);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        var patient = await repo.GetByIdAsync(id);
        if (patient == null)
            return TypedResults.Extensions.Error("The patient with this id has not been found", StatusCodes.Status404NotFound);

        await repo.UpdateAsync(request.Adapt(patient));

        return TypedResults.Ok();
    }
}
