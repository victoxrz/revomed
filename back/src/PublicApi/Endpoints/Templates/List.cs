using AppCore.Interfaces.Repository;
using Mapster;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class List : BaseEndpoint
{
    public record ListResponse(int Id, string Name);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/list", HandleAsync)
           .RequireAuthorization()
           .WithTags(Tag);
    }

    private IResult HandleAsync(IVisitTemplateRepository repo)
    {
        var templates = repo.GetAll();
        if (!templates.Any())
            return TypedResults.NotFound();

        return TypedResults.Ok(templates.ProjectToType<ListResponse>());
    }
}
