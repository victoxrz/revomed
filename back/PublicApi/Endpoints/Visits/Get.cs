using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace PublicApi.Endpoints.Visits;

public class Get
{
    public record GetResponse(int Id, int PatientId, DateTime CreatedAt, string[] Fields);

    public void Configure(IEndpointRouteBuilder app)
    {
        //app.MapGet(tag.ToLower() + "/get/{id}", HandleAsync)
        //    .RequireAuthorization()
        //    .WithTags(tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IVisitRepository repo, CancellationToken ct = default)
    {
        var visit = await repo.GetByIdAsync(id, ct);
        if (visit == null)
            return TypedResults.BadRequest();

        return TypedResults.Ok(visit.Adapt<GetResponse>());
    }
}
