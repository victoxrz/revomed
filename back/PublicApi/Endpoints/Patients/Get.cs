using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Domain.Enums;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class Get : BaseEndpoint
{
    public record GetResponse(
        int Id,
        string LastName,
        string FirstName,
        string Patronymic,
        DateOnly Birthday,
        Gender Gender,
        string IDNP,
        string Job,
        string Phone,
        string StreetAddress,
        string Country,
        BloodType BloodType);

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/get/{id}", HandleAsync)
            .RequireAuthorization()
            .WithTags(Tag);

        TypeAdapterConfig<Patient, GetResponse>.NewConfig().Map(d => d.IDNP, s => s.IDNP).Compile();
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IPatientRepository repo)
    {
        var patient = await repo.GetByIdAsync(id);
        if (patient == null)
            return TypedResults.BadRequest();

        return TypedResults.Ok(patient.Adapt<GetResponse>());
    }
}