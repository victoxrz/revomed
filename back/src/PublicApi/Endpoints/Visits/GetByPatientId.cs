using System.Security.Claims;
using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Visits;

public class GetByPatientId : BaseEndpoint
{
    public record MedicData(string FirstName, string LastName, string Specialty);

    public record TriageData(
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

    public record GetResponse(
        int Id,
        DateTime CreatedAt,
        List<List<string>> Titles,
        SortedDictionary<string, string> Fields,
        MedicData Medic,
        TriageData? Triage = null
    );

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        TypeAdapterConfig<Visit, GetResponse>
            .NewConfig()
            .Map(d => d.Titles, s => s.Template.Titles)
            .Map(d => d.Triage, s => s.Triage.Adapt<TriageData>() ?? null)
            .Compile();

        return app.MapGet(Tag.ToLower() + "/get", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic, Domain.Enums.UserRole.Patient)
            .WithTags(Tag);
    }

    /// <summary>
    /// Get visits by <paramref name="patientId"/>, only medics and the patient himself can access this endpoint
    /// </summary>
    /// <param name="patientId"></param>
    /// <param name="visitRepo"></param>
    /// <param name="userRepo"></param>
    /// <param name="claims"></param>
    /// <returns></returns>
    private async Task<IResult> HandleAsync(
        [FromQuery] int patientId,
        IVisitRepository visitRepo,
        IUserRepository userRepo,
        ClaimsPrincipal claims
    )
    {
        var email = claims.FindFirstValue(ClaimTypes.Email);
        if (email is null) // i think it should throw, its an exception case
            return TypedResults.Unauthorized();

        var user = await userRepo.FindByEmail(email).FirstOrDefaultAsync();

        if (user?.UserRole == Domain.Enums.UserRole.Patient && user.Id != patientId)
            return TypedResults.Forbid();

        var response = visitRepo.GetByPatientId(patientId);
        if (!response.Any())
            return TypedResults.BadRequest();

        return TypedResults.Ok(response.OrderByDescending(e => e.CreatedAt).ProjectToType<GetResponse>());
    }
}
