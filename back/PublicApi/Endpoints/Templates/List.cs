using AppCore.Interfaces.Repository;
using Mapster;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class List : BaseEndpoint
{
    public record ListResponse(int Id, string[] Titles);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/list", HandleAsync)
           .RequireAuthorization()
           .WithTags(Tag);
    }

    public IResult HandleAsync(IVisitTemplateRepository repo)
    {
        var templates = repo.GetAll();
        if (!templates.Any())
            return TypedResults.NotFound();

        return TypedResults.Ok(templates.ProjectToType<ListResponse>());
    }
}
