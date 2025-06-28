using AppCore.Interfaces.Repository;
using Domain.Enums;
using Mapster;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class List : BaseEndpoint
{
    public record ListResponse(int Id, string FirstName, string LastName, DateOnly Birthday, Gender Gender, string Phone);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/list", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);

    }

    public IResult HandleAsync(IPatientRepository repo)
    {
        var patients = repo.GetAll();
        if (!patients.Any())
            return TypedResults.NotFound();

        return TypedResults.Ok(patients.ProjectToType<ListResponse>());
    }

}
