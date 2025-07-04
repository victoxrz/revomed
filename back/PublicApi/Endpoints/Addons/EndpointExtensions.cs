using System.Reflection;

namespace PublicApi.Endpoints.Addons;

public static class EndpointExtensions
{
    public static IServiceCollection AddEndpoints(this IServiceCollection services, Assembly assembly)
    {
        var endpointTypes = assembly.DefinedTypes
            .Where(type => typeof(BaseEndpoint).IsAssignableFrom(type) && !type.IsInterface && !type.IsAbstract);

        foreach (var type in endpointTypes)
        {
            services.AddTransient(typeof(BaseEndpoint), type);
        }

        return services;
    }

    public static IApplicationBuilder MapEndpoints(this WebApplication app)
    {
        var endpoints = app.Services.GetRequiredService<IEnumerable<BaseEndpoint>>();

        foreach (var endpoint in endpoints)
        {
            endpoint.Configure(app);
        }

        return app;
    }

}
