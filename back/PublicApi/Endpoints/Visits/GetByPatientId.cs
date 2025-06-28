using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Visits;

public class GetByPatientId : BaseEndpoint
{
    public record GetResponse(int PatientId, int TemplateId, DateTime CreatedAt, string[] Fields);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/get", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);
    }

    public IResult HandleAsync([FromQuery] int patientId, IVisitRepository repo)
    {
        var response = repo.GetByPatientId(patientId);
        if (!response.Any())
            return TypedResults.BadRequest();

        return TypedResults.Ok(response.ProjectToType<GetResponse>());
    }
}