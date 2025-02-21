using System.Security.Claims;
using Infrastructure;
using AppCore.Services;
using AppCore;
using Domain.Entities.Users;
using Infrastructure.BL;
using AppCore.Interfaces.Repository;
using Infrastructure.BL;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints;
using AppCore.Interfaces.Services;





namespace PublicApi
{
    public sealed class Program
    {
        public static void Main(string[] args)
        {
            //Add-Migration and update-Database
            var builder = WebApplication.CreateBuilder(args);

            ConfigurationManager configuration = builder.Configuration;
            // Add services to the container.
            builder.Services.AddAuthorization();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddControllers();

            builder.Services.AddScoped<IPacientRepository, PacientRepository>();
            builder.Services.AddScoped<IPacientService, PacientService>();
            builder.Services.AddDbContext<PacientiDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddMinimalendpoints();
            builder.Services.AddScoped(typeof(IGenericRepository<Pacient, int>), typeof(GenericRepository<Pacient, int>));


            var app = builder.Build();



            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.RegisterExtentionEndpoints();
            app.UseHttpsRedirection();
            app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
