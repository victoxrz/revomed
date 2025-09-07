using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Visits;

public class GetByPatientId : BaseEndpoint
{
    public record MedicData(string FirstName, string LastName, string Specialty);

    public record TriageData(float Temperature,
        int SystolicPressure,
        int DiastolicPressure,
        int HeartRate,
        int RespiratoryRate,
        float Weight,
        int Height,
        float WaistCircumference,
        DateTime UpdatedAt);

    public record GetResponse(int Id, DateTime CreatedAt, List<List<string>> Titles, SortedDictionary<string, string> Fields, MedicData Medic, TriageData? Triage = null);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/get", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic)
            .WithTags(Tag);

        TypeAdapterConfig<Visit, GetResponse>.NewConfig()
            .Map(d => d.Titles, s => s.Template.Titles)
            .Map(d => d.Triage, s => s.Triage.Adapt<TriageData>() ?? null)
            .Compile();
    }

    private IResult HandleAsync([FromQuery] int patientId, IVisitRepository repo)
    {
        var response = repo.GetByPatientId(patientId);
        if (!response.Any())
            return TypedResults.BadRequest();

        return TypedResults.Ok(response.OrderByDescending(e => e.CreatedAt).ProjectToType<GetResponse>());
    }
}