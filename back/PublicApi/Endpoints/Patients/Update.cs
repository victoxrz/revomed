using AppCore.Interfaces.Repository;
using Domain.Entities;
using Mapster;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public sealed class Update : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Patients.ToString();
        app.MapPut(tag.ToLower() + "/update/{id}", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(tag);
    }

    public async Task<Results<Ok, NotFound>> HandleAsync([FromRoute] int id, [FromBody] UpdateRequest request, IPatientRepository repo)
    {
        var patient = await repo.GetByIdAsync(id);
        if (patient == null)
            return TypedResults.NotFound();

        await repo.UpdateAsync(request.Adapt(patient));

        return TypedResults.Ok();
    }

    public class UpdateRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateOnly Birthday { get; set; }
        public Domain.Enums.Gender Gender { get; set; }
        public string Patronymic { get; set; } = string.Empty;
        public Domain.Enums.BloodType BloodType { get; set; }
        public string IDNP { get; set; } = string.Empty;
        public string Job { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}
