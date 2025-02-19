using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using PublicApi.Endpoints.Abstractions;
using Domain.Entities.Users;
using Microsoft.AspNetCore.Mvc;
using AppCore.Interfaces.Services;

namespace PublicApi.Endpoints.Pacienti
{
    public sealed class Delete : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("/pacienti/{id}", async (int Id, [FromServices] IPacientService service) =>
            {
                var pacient = await service.GetPacientByIdAsync(Id);
                if (pacient == null)
                {
                    return Results.NotFound();
                }
                else
                {
                    await service.DeletePacientAsync(Id);
                    return Results.NoContent();
                }
            });

        }
    }
}
