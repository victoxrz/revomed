using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using AppCore.Contracts;
using PublicApi.Endpoints.Abstractions;
using Domain.Entities.Users;
using Microsoft.AspNetCore.Mvc;
namespace PublicApi.Endpoints.Pacienti
{

    public sealed class Create : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("/pacienti", async (PacientRequest pacient, [FromServices] IPacientService service) =>
            {
                if (pacient == null || service == null) throw new ArgumentNullException("Create endpoint faield");

                Pacient Pacient = new Pacient
                {
                    FirstName = pacient.FirstName,
                    LastName = pacient.LastName,
                    IDNP = pacient.IDNP,
                    Sex = pacient.Sex,
                    Phone = pacient.Phone,
                    StreetAdress = pacient.StreetAdress,
                    Country = pacient.Country,
                    DateTime = DateTime.Now
                };
                
                var result = await service.AddPacientAsync(Pacient);
                return Results.Created($"/pacienti/{result.Id}", result);
            });
        }
    }
}
