using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class Get : BaseEndpoint
{
    // maybe titles arent needed
    public record GetResponse(int Id, string Name, List<List<string>> Titles, bool RequireTriage);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/get/{id}", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic, Domain.Enums.UserRole.Admin)
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromRoute] int id, IVisitTemplateRepository repo, CancellationToken ct = default)
    {
        var template = await repo.GetByIdAsync(id, ct);
        if (template == null)
            return TypedResults.NotFound();

        return TypedResults.Ok(template.Adapt<GetResponse>());
    }
}
