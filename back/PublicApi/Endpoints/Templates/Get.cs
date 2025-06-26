using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using PublicApi.Endpoints.Visits;

namespace PublicApi.Endpoints.Templates;

public class Get : IEndpoint
{
    private record Response(string[] Titles);
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = SourceHelpers.GetSourceDirectory();
        app.MapGet(tag.ToLower() + "/get/{id}", HandleAsync)
            .RequireAuthorization()
            .WithTags(tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IVisitTemplateRepository repo)
    {
        var template = await repo.GetByIdAsync(id);
        return template == null ? TypedResults.NotFound() : TypedResults.Ok(template.Adapt<Response>());
    }
}
