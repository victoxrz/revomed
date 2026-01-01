using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using StackExchange.Redis;
using Testcontainers.PostgreSql;
using Testcontainers.Redis;

namespace PublicApi.IntegrationTests;

public class WebFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:17")
        .WithDatabase("test_revomed")
        .WithUsername("test_postgres")
        .WithPassword("test_postgres")
        .Build();

    private readonly RedisContainer _redisContainer = new RedisBuilder().WithImage("redis:7-alpine").Build();

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
        await _redisContainer.StartAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            // Replace PostgreSQL DbContext
            var dbDescriptor = services.SingleOrDefault(s =>
                s.ServiceType == typeof(DbContextOptions<PostgresDbContext>)
            );

            if (dbDescriptor != null)
                services.Remove(dbDescriptor);

            services.AddDbContext<PostgresDbContext>(options =>
            {
                var dataSource = new NpgsqlDataSourceBuilder(_dbContainer.GetConnectionString())
                    .EnableDynamicJson()
                    .Build();

                options.UseNpgsql(dataSource);
            });

            var cacheDescriptor = services.SingleOrDefault(s =>
                s.ServiceType == typeof(StackExchange.Redis.IConnectionMultiplexer)
            );

            if (cacheDescriptor != null)
                services.Remove(cacheDescriptor);

            services.AddSingleton<StackExchange.Redis.IConnectionMultiplexer>(sp =>
            {
                var options = ConfigurationOptions.Parse(_redisContainer.GetConnectionString(), true);
                options.AbortOnConnectFail = false;
                return ConnectionMultiplexer.Connect(options);
            });
        });
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await _dbContainer.StopAsync();
        await _redisContainer.StopAsync();
    }

    // After the host is created we run migrations + seed using the real service provider
    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        using (var scope = host.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PostgresDbContext>();
            db.Database.EnsureCreated();
        }

        return host;
    }

    public void SeedData(Action<PostgresDbContext, IServiceProvider> seeder)
    {
        using var scope = Services.CreateScope();

        var services = scope.ServiceProvider;
        var db = services.GetRequiredService<PostgresDbContext>();
        seeder(db, services);
    }
}
