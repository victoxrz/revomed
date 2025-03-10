using AppCore.Interfaces.Repository;
using Domain.Entities;
using Domain.Enums;
using Mapster;
using Microsoft.AspNetCore.Http.HttpResults;
using PublicApi.Endpoints.Addons;
using System.Linq.Expressions;

namespace PublicApi.Endpoints.Patients;

public sealed class List : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Patients.ToString();
        app.MapGet(tag.ToLower() + "/list", HandleAsync)
            .RequireAuthorization()
            .WithTags(tag);

    }

    public Results<Ok<List<ListResponse>>, NotFound> HandleAsync(IPatientRepository repo)
    {
        var patients = repo.GetAll();
        if(!patients.Any())
            return TypedResults.NotFound();
        
        return TypedResults.Ok(patients.Select(ListResponse.Project).ToList());
    }

    public class ListResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateOnly Birthday { get; set; }
        public Gender Gender { get; set; }
        public string Phone { get; set; } = string.Empty;

        public static Expression<Func<Patient, ListResponse>> Project =>
            patient => new ListResponse
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Birthday = patient.Birthday,
                Gender = patient.Gender,
                Phone = patient.Phone,
            };
    }
}
