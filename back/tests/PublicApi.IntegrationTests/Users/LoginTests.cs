using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PublicApi.Endpoints.Users;

namespace PublicApi.IntegrationTests.Users;

public class LoginTests : BaseIntegrationTest
{
    private const string _testEmail = "test@gmail.com";
    private const string _testPassword = "parolasecreta";

    public LoginTests(WebFactory factory)
        : base(factory)
    {
        factory.SeedData(
            (db, services) =>
            {
                db.Database.ExecuteSql($"TRUNCATE TABLE \"Users\" RESTART IDENTITY CASCADE;");

                var hashProvider = services.GetRequiredService<Infrastructure.Identity.HashProvider>();
                db.Users.Add(new() { Email = _testEmail, Password = hashProvider.Hash(_testPassword) });

                db.SaveChanges();
            }
        );
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsToken()
    {
        // Arrange
        var formContent = new FormUrlEncodedContent([
            new("Email", _testEmail),
            new("Password", _testPassword),
        ]);

        // Act
        var response = await _client.PostAsync("/users/login", formContent);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<Login.LoginResponse>();
        Assert.NotNull(result);
        Assert.NotEmpty(result!.SessionId);
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized()
    {
        // Arrange
        var formContent = new FormUrlEncodedContent([
            new("Email", _testEmail),
            new("Password", _testPassword + "cfvg"),
        ]);

        // Act
        var response = await _client.PostAsync("/users/login", formContent);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        var result = await response.Content.ReadAsByteArrayAsync();
        Assert.Empty(result);
    }

    [Fact]
    public async Task Login_InvalidEmail_ReturnsUnauthorized()
    {
        // Arrange
        var formContent = new FormUrlEncodedContent([
            new("Email", _testEmail + "dass"),
            new("Password", _testPassword),
        ]);

        // Act
        var response = await _client.PostAsync("/users/login", formContent);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        var result = await response.Content.ReadAsByteArrayAsync();
        Assert.Empty(result);
    }
}
