using AppCore.Interfaces.Repository;
using Azure;
using Domain.Enums;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Get : BaseEndpoint
{
    public record GetResponse(int Id, string Email, string FirstName, string LastName, UserRole UserRole);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/get/{id}", HandleAsync)
            .RequireAuthorization()
            //.RequireRoles(UserRole.Admin)
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync(
        [FromRoute] int id,
        IUserRepository repo,
        CancellationToken ct = default
    )
    {
        var patient = await repo.GetByIdAsync(id, ct);
        if (patient == null)
            return TypedResults.BadRequest();

        return TypedResults.Ok(patient.Adapt<GetResponse>());
    }
}
