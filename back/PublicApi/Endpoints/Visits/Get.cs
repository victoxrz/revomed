using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Visits;

public class Get : IEndpoint
{
    public record GetResponse(int Id, int PatientId, DateTime CreatedAt, string[] Fields);

    public void Configure(IEndpointRouteBuilder app)
    {
        //var tag = EndpointTags.Visits.ToString();
        //app.MapGet(tag.ToLower() + "/get/{id}", HandleAsync)
        //    .RequireAuthorization()
        //    .WithTags(tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IVisitRepository repo)
    {
        var visit = await repo.GetByIdAsync(id);
        if (visit == null)
            return TypedResults.BadRequest();

        return TypedResults.Ok(visit.Adapt<GetResponse>());
    }
}
