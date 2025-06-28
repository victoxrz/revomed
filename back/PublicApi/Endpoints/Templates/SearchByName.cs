using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class SearchByName : BaseEndpoint
{
    public record SearchResponse(int Id, string Name);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/search", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);
    }

    public IResult HandleAsync([FromQuery] string name, IVisitTemplateRepository repo)
    {
        var template = repo.SearchByNameAsync(name);
        return template == null ? TypedResults.NotFound() : TypedResults.Ok(template.ProjectToType<SearchResponse>());
    }
}