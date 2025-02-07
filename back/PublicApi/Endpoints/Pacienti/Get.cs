using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using PublicApi.Endpoints.Abstractions;
using Domain.Entities.Users;
using Microsoft.AspNetCore.Mvc;


namespace PublicApi.Endpoints.Pacienti
{
    public sealed class Get : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("pacienti/{id}", async (ushort Id, IPacientService service) =>
            {
                var pacient = await service.GetPacientByIdAsync(Id);
                return Results.Created("id", pacient);
            });

        }

    }
}
