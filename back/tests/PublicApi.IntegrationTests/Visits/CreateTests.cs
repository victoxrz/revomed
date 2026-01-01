using System.Net;
using System.Net.Http.Json;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PublicApi.Endpoints.Users;
using PublicApi.Endpoints.Visits;

namespace PublicApi.IntegrationTests.Visits;

public class CreateTests : BaseIntegrationTest
{
    public CreateTests(WebFactory factory)
        : base(factory)
    {
        factory.SeedData(
            (db, services) =>
            {
                // Clear existing data
                db.Database.ExecuteSql($"TRUNCATE TABLE \"Users\" RESTART IDENTITY CASCADE;");
                db.Database.ExecuteSql($"TRUNCATE TABLE \"Patients\" RESTART IDENTITY CASCADE;");
                db.Database.ExecuteSql($"TRUNCATE TABLE \"Templates\" RESTART IDENTITY CASCADE;");

                var hashProvider = services.GetRequiredService<HashProvider>();
                // Seed necessary data for tests
                db.Medics.Add(
                    new()
                    {
                        Email = "medic@gmail.com",
                        Password = hashProvider.Hash("medicmedic"),
                        Specialty = "Cardiology",
                    }
                );

                db.Users.Add(new() { Email = "user@gmail.com", Password = hashProvider.Hash("useruser") });

                db.Patients.Add(
                    new()
                    {
                        FirstName = "Test",
                        LastName = "Patient",
                        Birthday = DateOnly.FromDateTime(DateTime.Now.AddYears(-30)),
                        Gender = Domain.Enums.Gender.Male,
                        Phone = "123456789",
                        BloodType = Domain.Enums.BloodType.ABmin,
                        Country = "Country",
                        StreetAddress = "StreetAddress",
                        Idnp = "1234567890123",
                        Job = "Job",
                    }
                );

                db.Templates.Add(
                    new()
                    {
                        Name = "General Checkup",
                        RequireTriage = false,
                        Titles =
                        [
                            ["Title 1", "Subtitle 1"],
                            ["Title 2"],
                        ],
                    }
                );

                db.SaveChanges();
            }
        );
    }

    [Fact]
    public async Task CreateVisit_NonMedicUser_ReturnsForbidden()
    {
        // Arrange
        var request = new Create.CreateRequest(1, 1, new() { ["1-0"] = "for title 2" });
        var formContent = new FormUrlEncodedContent([
            new("Email", "user@gmail.com"),
            new("Password", "useruser"),
        ]);

        var loginResponse = await _client.PostAsync("/users/login", formContent);
        var loginResult = await loginResponse.Content.ReadFromJsonAsync<Login.LoginResponse>();
        _client.DefaultRequestHeaders.Authorization = new(loginResult!.SessionId);

        // Act
        var response = await _client.PostAsJsonAsync("/visits/create", request);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task CreateVisit_MedicUserDoesntFollowTemplate_ReturnsBadRequest()
    {
        // Arrange
        var request = new Create.CreateRequest(1, 1, new() { ["1-100"] = "for title 1, it can't have data" });
        var formContent = new FormUrlEncodedContent([
            new("Email", "medic@gmail.com"),
            new("Password", "medicmedic"),
        ]);

        var loginResponse = await _client.PostAsync("/users/login", formContent);
        var loginResult = await loginResponse.Content.ReadFromJsonAsync<Login.LoginResponse>();
        _client.DefaultRequestHeaders.Authorization = new(loginResult!.SessionId);

        // Act
        var response = await _client.PostAsJsonAsync("/visits/create", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var responseContent = await response.Content.ReadFromJsonAsync<Endpoints.Addons.ErrorResponse>();
        Assert.Equal("Visit does not follow the template", responseContent!.Message);
    }

    [Fact]
    public async Task CreateVisit_ValidRequest_ReturnsCreated()
    {
        // Arrange
        var request = new Create.CreateRequest(1, 1, new() { ["1-0"] = "for title 2, it can have data" });
        var formContent = new FormUrlEncodedContent([
            new("Email", "medic@gmail.com"),
            new("Password", "medicmedic"),
        ]);

        var loginResponse = await _client.PostAsync("/users/login", formContent);
        var loginResult = await loginResponse.Content.ReadFromJsonAsync<Login.LoginResponse>();
        _client.DefaultRequestHeaders.Authorization = new(loginResult!.SessionId);

        // Act
        var response = await _client.PostAsJsonAsync("/visits/create", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }
}
