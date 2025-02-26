using AppCore.Contracts;
using AppCore.Interfaces.Services;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients
{
    public sealed class Update : IEndpoint
    {
        public void Configure(IEndpointRouteBuilder app)
        {
            app.MapPut("/pacineti/{id:int}", HandleAsync);
        }

        public async Task HandleAsync(int Id, PacientRequest pacient, IPatientService service)
        {
            await service.UpdatePacientByIdAsync(Id, pacient);
        }
    }
}
