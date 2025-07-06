using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class Get : BaseEndpoint
{
    // maybe titles arent needed
    public record GetResponse(int Id, string MedicSpecialty, string[] Titles);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/get/{id}", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic)
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IVisitTemplateRepository repo)
    {
        var template = await repo.GetByIdAsync(id);
        if (template == null)
            return TypedResults.NotFound();

        return TypedResults.Ok(template.Adapt<GetResponse>());
    }
}
