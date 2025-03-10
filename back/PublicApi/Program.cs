using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Infrastructure.Data;
using Infrastructure.Identity;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Mapster;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using PublicApi.Endpoints.Addons;
using Scalar.AspNetCore;
using System.Reflection;
using System.Text;

namespace PublicApi
{
    public sealed class Program
    {
        // TODO: consider removing Mapster in favor for implementing manual mapping or another lightweight
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddOpenApi(options =>
            {
                options.OpenApiVersion = OpenApiSpecVersion.OpenApi3_0;
                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });

            builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());

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
            builder.Services.AddSingleton<HashProvider>();

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

            builder.Services.AddScoped<IPatientRepository, PatientRepository>();
            builder.Services.AddScoped<IPatientService, PatientService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            //builder.Services.AddDbContext<PostgresDbContext>(options =>
            //    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddDbContext<PostgresDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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
