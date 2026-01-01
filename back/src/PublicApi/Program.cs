using System.Reflection;
using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using AppCore.Services;
using FluentValidation;
using Infrastructure.Configuration;
using Infrastructure.Data;
using Infrastructure.Handlers;
using Infrastructure.Identity;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Users;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Npgsql;
using PublicApi.Authentication;
using PublicApi.Endpoints.Addons;
using Scalar.AspNetCore;
using StackExchange.Redis;

namespace PublicApi
{
    public sealed class Program
    {
        // TODO: consider removing Mapster in favor for implementing manual mapping or another lightweight
        // TODO: remove default values in DB
        public static void Main(string[] args)
        {
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddOpenApi(options =>
            {
                options.OpenApiVersion = OpenApiSpecVersion.OpenApi3_0;
                options.AddDocumentTransformer<ApiKeySecuritySchemeTransformer>();
                options.CreateSchemaReferenceId = jsonTypeInfo =>
                {
                    var schemaId = OpenApiOptions.CreateDefaultSchemaReferenceId(jsonTypeInfo);
                    var ns = jsonTypeInfo.Type.Namespace ?? "";
                    if (schemaId != null && ns.Contains("Endpoints"))
                    {
                        var folder = ns.Split('.').Last();
                        schemaId = $"{folder}{schemaId}";
                    }
                    return schemaId;
                };
            });

            builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());
            builder.Services.AddValidatorsFromAssembly(
                Assembly.GetExecutingAssembly(),
                ServiceLifetime.Transient
            );

            builder.Services.AddCors(opt =>
            {
                opt.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyHeader();
                    policy.AllowAnyMethod();
                    policy
                        .WithOrigins("http://localhost:3000", "http://localhost:5173") // Add your frontend URLs
                        .AllowCredentials(); // Allow cookies to be sent
                });
            });
            // TODO: finally add antiforgery, maybe
            //builder.Services.AddAntiforgery();

            //builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var options = ConfigurationOptions.Parse(
                    builder.Configuration.GetConnectionString("Redis")!,
                    true
                );
                options.AbortOnConnectFail = false;
                return ConnectionMultiplexer.Connect(options);
            });
            //builder.Services.AddStackExchangeRedisCache(options =>
            //{
            //    options.Configuration = builder.Configuration.GetConnectionString("Redis");
            //    options.InstanceName = "RevomedSession:";
            //    options.ConnectionMultiplexerFactory = async () =>
            //    {
            //        var options = ConfigurationOptions.Parse(
            //            builder.Configuration.GetConnectionString("Redis")!,
            //            true
            //        );
            //        options.AbortOnConnectFail = false;
            //        return await ConnectionMultiplexer.ConnectAsync(options);
            //    };
            //});

            builder.Services.AddScoped<ISessionStore, RedisSessionStore>();

            builder.Services.AddSingleton<HashProvider>();

            builder.Services.AddHttpClient<IInsuranceProvider, CnamInsuranceProvider>(o =>
            {
                o.BaseAddress = new Uri("https://aoam.cnam.gov.md:10202");
                o.Timeout = TimeSpan.FromSeconds(10);
                o.DefaultRequestHeaders.Add("Origin", "https://aoam.cnam.gov.md:10201");
            });

            builder
                .Services.AddAuthentication("Session")
                .AddScheme<AuthenticationSchemeOptions, SessionAuthenticationHandler>("Session", null);

            builder.Services.AddAuthorization();

            builder.Services.AddScoped<IProcessVisitService, ProcessVisitService>();
            builder.Services.AddScoped<IPatientRepository, PatientRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IVisitRepository, VisitRepository>();
            builder.Services.AddScoped<IVisitTemplateRepository, VisitTemplateRepository>();
            builder.Services.AddScoped<IMedicRepository, MedicRepository>();
            builder.Services.AddScoped<ITriageRepository, TriageRepository>();
            builder.Services.AddScoped<IVisitSuggestionRepository, VisitSuggestionRepository>();

            var dataSource = new NpgsqlDataSourceBuilder(
                builder.Configuration.GetConnectionString("DefaultConnection")
            )
                .EnableDynamicJson()
                .Build();

            builder.Services.AddDbContext<PostgresDbContext>(options => options.UseNpgsql(dataSource));

            builder.Services.ConfigureHttpJsonOptions(o =>
            {
                o.SerializerOptions.PropertyNamingPolicy = JsonConfiguration
                    .CamelCaseOptions
                    .PropertyNamingPolicy;
                o.SerializerOptions.DictionaryKeyPolicy = JsonConfiguration
                    .CamelCaseOptions
                    .DictionaryKeyPolicy;
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference(options => options.AddPreferredSecuritySchemes("Session"));
            }

            //app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors();

            app.MapEndpoints();
            app.Run();
        }

        internal sealed class ApiKeySecuritySchemeTransformer(
            IAuthenticationSchemeProvider authenticationSchemeProvider
        ) : IOpenApiDocumentTransformer
        {
            public async Task TransformAsync(
                OpenApiDocument document,
                OpenApiDocumentTransformerContext context,
                CancellationToken cancellationToken
            )
            {
                var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
                if (authenticationSchemes.Any(authScheme => authScheme.Name == "Session"))
                {
                    var requirements = new Dictionary<string, IOpenApiSecurityScheme>
                    {
                        ["Session"] = new OpenApiSecurityScheme
                        {
                            Type = SecuritySchemeType.ApiKey,
                            In = ParameterLocation.Header,
                            Name = "Session",
                        },
                    };
                    document.Components ??= new OpenApiComponents();
                    document.Components.SecuritySchemes = requirements;
                }
            }
        }
    }
}
