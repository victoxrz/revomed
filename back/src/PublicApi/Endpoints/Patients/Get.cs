using AppCore.Interfaces.Repository;
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
        string Idnp,
        string Job,
        string Phone,
        string StreetAddress,
        string Country,
        BloodType BloodType,
        string InsurancePolicy,
        bool? IsInsured);

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/get/{id}", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(UserRole.Medic, UserRole.Admin)
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromRoute] int id, IPatientRepository repo, CancellationToken ct = default)
    {
        var patient = await repo.GetByIdAsync(id, ct);
        if (patient == null)
            return TypedResults.BadRequest();

        return TypedResults.Ok(patient.Adapt<GetResponse>());
    }
}