using System.Net;
using AppCore.Interfaces.Services;
using Domain.Entities.Users;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace PublicApi.IntegrationTests.Authentication;

public class SessionAuthenticationHandlerTests : BaseIntegrationTest
{
    private readonly User user = new()
    {
        Email = "auth-test@example.com",
        Password = "hashed_password",
        FirstName = "Test",
        LastName = "User",
        UserRole = UserRole.Patient,
    };

    public SessionAuthenticationHandlerTests(WebFactory factory)
        : base(factory)
    {
        factory.SeedData(
            (db, services) =>
            {
                db.Database.ExecuteSql($"TRUNCATE TABLE \"Users\" RESTART IDENTITY CASCADE;");
                db.Users.Add(user);
                db.SaveChanges();
            }
        );
    }

    [Fact]
    public async Task HandleAuthenticateAsync_NoHeader_ReturnsUnauthorized()
    {
        // Arrange

        // Act
        var response = await _client.GetAsync("/users/profile");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task HandleAuthenticateAsync_InvalidSessionId_ReturnsUnauthorized()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add("Authorization", "invalid-session-id");

        // Act
        var response = await _client.GetAsync("/users/profile");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task HandleAuthenticateAsync_ValidSession_ReturnsOk()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var sessionStore = scope.ServiceProvider.GetRequiredService<ISessionStore>();

        // Create Session
        var session = new UserSession(
            user.Id,
            user.Email,
            user.UserRole.ToString(),
            "TestAgent",
            "127.0.0.1",
            DateTime.UtcNow
        );
        var sessionId = await sessionStore.CreateSessionAsync(session);
        _client.DefaultRequestHeaders.Add("Authorization", sessionId);

        // Act
        var response = await _client.GetAsync("/users/profile");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
