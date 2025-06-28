using AppCore.Interfaces.Repository;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients
{
    public class Delete : BaseEndpoint
    {
        public override void Configure(IEndpointRouteBuilder app)
        {
            app.MapDelete(Tag.ToLower() + "/delete/{id}", HandleAsync)
                .DisableAntiforgery()
                .RequireAuthorization()
                .WithTags(Tag);
        }

        public async Task<IResult> HandleAsync([FromRoute] int id, IPatientRepository repo)
        {
            var patient = await repo.GetByIdAsync(id);
            if (patient == null)
                return TypedResults.NotFound();

            await repo.DeleteAsync(patient);

            return TypedResults.Ok();
        }
    }
}
