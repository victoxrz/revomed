using AppCore.Interfaces.Repository;
using Azure;
using Domain.Enums;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class List : BaseEndpoint
{
    public record ListItem(int Id, string Email, string FirstName, string LastName, UserRole UserRole);

    public record ListResponse(IEnumerable<ListItem> Users, int TotalCount);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/list", HandleAsync)
            .RequireAuthorization()
            //.RequireRoles(UserRole.Admin)
            .WithTags(Tag);
    }

    private IResult HandleAsync([FromQuery] int Page, [FromQuery] int PageSize, IUserRepository repo)
    {
        var patients = repo.GetAll();
        if (!patients.Any())
            return TypedResults.NotFound();

        var response = new ListResponse(
            patients
                .OrderBy(p => p.Id)
                .Skip((Page - 1) * PageSize)
                .Take(PageSize)
                .Select(p => p.Adapt<ListItem>()),
            patients.Count()
        );

        return TypedResults.Ok(response);
    }
}
