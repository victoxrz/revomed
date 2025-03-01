using AppCore.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients
{
    public sealed class Delete : IEndpoint
    {
        public void Configure(IEndpointRouteBuilder app)
        {
            app.MapPost("/pacienti/{id}", HandleAsync);
        }

        public async Task HandleAsync(int Id, [FromServices] IPatientService service)
        {
            var pacient = await service.GetPacientByIdAsync(Id);
            if (pacient == null)
            {
                //return Task.FromResult(Results.NotFound());
            }
            else
            {
                await service.DeletePacientAsync(Id);
                //return Results.NoContent();
            }
        }
    }
}
