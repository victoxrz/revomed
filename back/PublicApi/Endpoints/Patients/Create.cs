using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class Create : BaseEndpoint
{
    public record CreateRequest(
        string FirstName,
        string LastName,
        string Patronymic,
        DateOnly Birthday,
        Domain.Enums.Gender Gender,
        Domain.Enums.BloodType BloodType,
        string Idnp,
        string Job,
        string StreetAddress,
        string Country,
        string Phone,
        string InsurancePolicy);

    public class CreateRequestValidator : AbstractValidator<CreateRequest>
    {
        public CreateRequestValidator()
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
            RuleFor(x => x.InsurancePolicy).MaximumLength(15);
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPost(Tag.ToLower() + "/create", HandleAsync)
            .WithValidation<CreateRequest>()
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(Tag);
    }

    // JsonStringEnumConverter only works with FromBody
    // https://github.com/dotnet/aspnetcore/issues/49398
    private async Task<IResult> HandleAsync([FromBody] CreateRequest request, IPatientRepository repo)
    {
        var response = await repo.AddAsync(request.Adapt<Patient>());

        if (!response.IsSuccessful)
        {
            return TypedResults.BadRequest(new ErrorResponse(response.Error));
        }

        return TypedResults.Created();
    }
}
