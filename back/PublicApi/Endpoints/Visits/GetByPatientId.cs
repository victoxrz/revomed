using AppCore.Interfaces.Repository;
using Domain.Entities;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Visits;

public class GetByPatientId : BaseEndpoint
{
    public record GetResponse(int Id, DateTime CreatedAt, string[] Titles, string[] Fields);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/get", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);

        TypeAdapterConfig<Visit, GetResponse>.NewConfig().Map(d => d.Titles, s => s.Template.Titles).Compile();
    }

    public IResult HandleAsync([FromQuery] int patientId, IVisitRepository repo)
    {
        var response = repo.GetByPatientId(patientId);
        if (!response.Any())
            return TypedResults.BadRequest();

        return TypedResults.Ok(response.ProjectToType<GetResponse>());
    }
}