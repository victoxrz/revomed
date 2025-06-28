using AppCore.Interfaces.Repository;
using Domain.Enums;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class Get : BaseEndpoint
{
    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/get/{id}", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IPatientRepository repo)
    {
        var patient = await repo.GetByIdAsync(id);
        if (patient == null)
            return TypedResults.BadRequest();

        return TypedResults.Ok(patient.Adapt<GetResponse>());
    }
}

public class GetResponse
{
    public int Id { get; set; }
    public string LastName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string Patronymic { get; set; } = string.Empty;
    public DateOnly Birthday { get; set; }
    public Gender Gender { get; set; }
    public string IDNP { get; set; } = string.Empty;
    public string Job { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string StreetAddress { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public BloodType BloodType { get; set; }
}
