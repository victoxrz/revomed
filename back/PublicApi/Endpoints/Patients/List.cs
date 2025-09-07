using AppCore.Interfaces.Repository;
using Domain.Enums;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class List : BaseEndpoint
{
    public record ListItem(int Id, string FirstName, string LastName, DateOnly Birthday, Gender Gender, string Phone);
    public record ListResponse(IEnumerable<ListItem> Patients, int TotalCount);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/list", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(UserRole.Medic)
            .WithTags(Tag);
    }

    private IResult HandleAsync([FromQuery] int Page, [FromQuery] int PageSize, IPatientRepository repo)
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
            patients.Count());

        return TypedResults.Ok(response);
    }

}
