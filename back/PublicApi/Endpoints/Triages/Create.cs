using AppCore.Interfaces.Repository;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Triages;

public class Create : BaseEndpoint
{
    public record CreateRequest(
        float Temperature,
        int SystolicPressure,
        int DiastolicPressure,
        int HeartRate,
        int RespiratoryRate,
        float Weight,
        int Height,
        float WaistCircumference
    );

    public class CreateRequestValidator : AbstractValidator<CreateRequest>
    {
        public CreateRequestValidator()
        {
            RuleFor(x => x.Temperature).InclusiveBetween(30.0f, 45.0f);
            RuleFor(x => x.SystolicPressure).InclusiveBetween(50, 300);
            RuleFor(x => x.DiastolicPressure).InclusiveBetween(30, 300);
            RuleFor(x => x.HeartRate).InclusiveBetween(30, 200);
            RuleFor(x => x.RespiratoryRate).InclusiveBetween(5, 60);
            RuleFor(x => x.Weight).GreaterThan(0);
            RuleFor(x => x.Height).GreaterThan(0);
            RuleFor(x => x.WaistCircumference).GreaterThan(0);
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPost(Tag.ToLower() + "/create", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic)
            .WithValidation<CreateRequest>()
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromBody] CreateRequest request, [FromQuery] int patientId, ITriageRepository repo)
    {
        var triage = request.Adapt<Domain.Entities.Visits.Triage>();
        triage.PatientId = patientId;

        var response = await repo.AddAsync(triage);

        if (!response.IsSuccessful)
            return TypedResults.BadRequest(new ErrorResponse(response.Error));

        return TypedResults.Created();
    }
}
