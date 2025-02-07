using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using PublicApi.Endpoints.Abstractions;
using Domain.Entities.Users;
using Microsoft.AspNetCore.Mvc;
using AppCore.Contracts;

namespace PublicApi.Endpoints.Pacienti
{
    public sealed class Update : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPut("/pacineti/{id:int}", async (int Id, PacientRequest pacient, IPacientService service) =>
            {
                await service.UpdatePacientByIdAsync(Id, pacient);
            });
 
        }
    }
}
