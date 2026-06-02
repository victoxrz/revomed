using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class List : BaseEndpoint
{
    public record ListItem(int Id, string Name);

    public record ListResponse(IEnumerable<ListItem> Templates, int TotalCount);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/list", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Admin, Domain.Enums.UserRole.Medic)
            .WithTags(Tag);
    }

    private IResult HandleAsync([FromQuery] int Page, [FromQuery] int PageSize, IVisitTemplateRepository repo)
    {
        var templates = repo.GetAll();
        if (!templates.Any())
            return TypedResults.NotFound();

        var response = new ListResponse(
            templates
                .OrderBy(p => p.Id)
                .Skip((Page - 1) * PageSize)
                .Take(PageSize)
                .Select(p => p.Adapt<ListItem>()),
            templates.Count()
        );

        return TypedResults.Ok(response);
    }
}
