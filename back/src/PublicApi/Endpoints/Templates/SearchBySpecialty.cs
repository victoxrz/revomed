using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class SearchBySpecialty : BaseEndpoint
{
    public record SearchResponse(int Id, string MedicSpecialty, string[] Titles);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        // This endpoint appears to be commented out/disabled
        // Returning a placeholder route that won't actually be mapped
        return app.MapGet(Tag.ToLower() + "/search", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);
    }

    private IResult HandleAsync([FromQuery] string name, IVisitTemplateRepository repo)
    {
        var template = repo.SearchByNameAsync(name);
        return template == null ? TypedResults.NotFound() : TypedResults.Ok(template.ProjectToType<SearchResponse>());
    }
}