using FluentValidation.Validators;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PublicApi.Endpoints.Abstractions;
using System.Runtime.CompilerServices;

namespace PublicApi.Endpoints
{
    public static class EndpointExtension
    {
        public static IServiceCollection AddMinimalendpoints(this IServiceCollection services)
        {
            var assembly = typeof(Program).Assembly;
            var serviceDesciptor = assembly
                .DefinedTypes.Where(type => !type.IsAbstract &&
                                             !type.IsInterface &&
                                              type.IsAssignableTo(typeof(IEndpoint)))
                .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type));

            services.TryAddEnumerable(serviceDesciptor);

            return services;

        }

        public static IApplicationBuilder RegisterExtentionEndpoints(this WebApplication app)
        {
            var endpoints = app.Services.GetRequiredService<IEnumerable<IEndpoint>>();

            foreach (var endpoint in endpoints)
            {
                endpoint.MapEndpoint(app);
            }

            return app;
        }

    }
}
