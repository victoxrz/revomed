using AppCore.Interfaces.Repository;
using Domain.Entities;
using Domain.Enums;
using Mapster;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class Create : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Patients.ToString();
        app.MapPost(tag.ToLower() + "/create", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(tag);
    }

    // JsonStringEnumConverter only works with FromBody
    // https://github.com/dotnet/aspnetcore/issues/49398
    public async Task<Results<Created, BadRequest<string>>> HandleAsync([FromBody] CreateRequest request, IPatientRepository repo)
    {
        var isSuccesful = await repo.AddAsync(request.Adapt<Patient>());
        if (!isSuccesful)
            return TypedResults.BadRequest("Patient with this IDNP already exists");

        return TypedResults.Created();
    }

    public class CreateRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateOnly Birthday { get; set; }
        public Gender Gender { get; set; }
        public string Patronymic { get; set; } = string.Empty;
        public BloodType BloodType { get; set; }
        public string IDNP { get; set; } = string.Empty;
        public string Job { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}
