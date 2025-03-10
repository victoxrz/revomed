using AppCore.Interfaces.Repository;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients
{
    public sealed class Delete : IEndpoint
    {
        public void Configure(IEndpointRouteBuilder app)
        {
            var tag = EndpointTags.Patients.ToString();
            app.MapPost(tag.ToLower() + "/delete/{id}", HandleAsync)
                .DisableAntiforgery()
                .RequireAuthorization()
                .WithTags(tag);
        }

        public async Task<Results<NotFound, Ok>> HandleAsync([FromRoute] int id, IPatientRepository repo)
        {
            var patient = await repo.GetByIdAsync(id);
            if (patient == null)
                return TypedResults.NotFound();

            await repo.DeleteAsync(patient);

            return TypedResults.Ok();
        }
    }
}
