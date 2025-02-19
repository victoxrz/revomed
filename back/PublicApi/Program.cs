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
using AppCore.Interfaces.UnitOfwork;

using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PublicApi.Endpoints.Addons;
using Scalar.AspNetCore;
using System.Reflection;
using System.Text;

using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PublicApi.Endpoints.Addons;
using Scalar.AspNetCore;
using System.Reflection;
using System.Text;

namespace PublicApi
{
    public sealed class Program
    {
        public static void Main(string[] args)
        {
            //Add-Migration and update-Database
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddOpenApi(options =>
            {
                //options.OpenApiVersion = OpenApiSpecVersion.OpenApi3_0;
                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });

            builder.Services.AddCors(opt =>
            {
                opt.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyHeader();
                    policy.AllowAnyMethod();
                    policy.AllowAnyOrigin();
                });
            });
            //builder.Services.AddAntiforgery();
            builder.Services.AddSingleton<TokenProvider>();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(o =>
                {
                    var settings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
                    o.RequireHttpsMetadata = false;
                    o.TokenValidationParameters = new()
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret)),
                        ValidIssuer = settings.Issuer,
                        ValidAudience = settings.Audience,
                        ClockSkew = TimeSpan.Zero
                    };
                });
            builder.Services.AddAuthorization();

            builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());

            builder.Services.AddScoped<IPacientRepository, PacientRepository>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IPacientService, PacientService>();
            builder.Services.AddDbContext<PacientiDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddMinimalendpoints();
            builder.Services.AddScoped(typeof(IGenericRepository<Pacient, int>), typeof(GenericRepository<Pacient, int>));


            var app = builder.Build();



            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            //app.UseHttpsRedirection();

            //app.UseAntiforgery();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors();

            app.MapEndpoints();
            app.Run();
        }
        internal sealed class BearerSecuritySchemeTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider) : IOpenApiDocumentTransformer
        {
            public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
            {
                var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
                if (authenticationSchemes.Any(authScheme => authScheme.Name == "Bearer"))
                {
                    var requirements = new Dictionary<string, OpenApiSecurityScheme>
                    {
                        ["Bearer"] = new OpenApiSecurityScheme
                        {
                            Type = SecuritySchemeType.Http,
                            Scheme = "bearer", // "bearer" refers to the header name here
                            In = ParameterLocation.Header,
                            BearerFormat = "Json Web Token"
                        }
                    };
                    document.Components ??= new OpenApiComponents();
                    document.Components.SecuritySchemes = requirements;
                }
            }
        }
    }
}
