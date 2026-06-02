using AppCore.Interfaces.Repository;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Delete : BaseEndpoint
{
    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapDelete(Tag.ToLower() + "/delete/{id}", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            //.RequireRoles(Domain.Enums.UserRole.Admin)
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IUserRepository repo)
    {
        var user = await repo.GetByIdAsync(id);
        if (user == null)
            return TypedResults.NotFound();

        await repo.DeleteAsync(user);

        return TypedResults.Ok();
    }
}
