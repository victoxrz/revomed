using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Triages;

public class GetByPatientId : BaseEndpoint
{
    public record GetResponse(
        float Temperature,
        int SystolicPressure,
        int DiastolicPressure,
        int HeartRate,
        int RespiratoryRate,
        float Weight,
        int Height,
        float WaistCircumference,
        DateTime UpdatedAt
    );

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/get", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic)
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromQuery] int patientId, ITriageRepository repo, CancellationToken ct)
    {
        var response = await repo.GetByPatientId(patientId, ct);
        if (response == null)
            return TypedResults.BadRequest();

        return TypedResults.Ok(response.Adapt<GetResponse>());
    }
}
