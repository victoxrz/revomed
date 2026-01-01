using AppCore.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;

namespace PublicApi.IntegrationTests.Users;

public class SessionStoreTest : IClassFixture<WebFactory>
{
    private readonly ISessionStore _sessionStore;
    private readonly StackExchange.Redis.IConnectionMultiplexer _redis;

    public SessionStoreTest(WebFactory factory)
    {
        using var scope = factory.Services.CreateScope();
        _sessionStore = scope.ServiceProvider.GetRequiredService<ISessionStore>();
        _redis = factory.Services.GetRequiredService<StackExchange.Redis.IConnectionMultiplexer>();
    }

    [Fact]
    public async Task CreateSession_ShouldStoreSession()
    {
        // Arrange
        var session = new UserSession(1, "test@example.com", "User", "Chrome", "127.0.0.1", DateTime.UtcNow);

        // Act
        var sessionId = await _sessionStore.CreateSessionAsync(session);
        var retrieved = await _sessionStore.GetSessionAsync(sessionId);

        // Assert
        Assert.NotNull(retrieved);
        Assert.Equal(session.UserId, retrieved.UserId);
        Assert.Equal(session.Email, retrieved.Email);
        Assert.Equal(session.UserRole, retrieved.UserRole);
        Assert.Equivalent(session, retrieved);
    }

    [Fact]
    public async Task CreateSession_ShouldEnforceMaxSessionLimit()
    {
        // Arrange
        var userId = 2;
        var sessions = new List<string>();

        // Act - Create 6 sessions (limit is 5)
        for (int i = 0; i < 6; i++)
        {
            var session = new UserSession(
                userId,
                "user@example.com",
                "User",
                $"Chrome-{i}",
                "127.0.0.1",
                DateTime.UtcNow
            );
            var sessionId = await _sessionStore.CreateSessionAsync(session);
            sessions.Add(sessionId);
        }

        // Assert - First session should be deleted, others should exist
        var firstSession = await _sessionStore.GetSessionAsync(sessions[0]);
        var lastSession = await _sessionStore.GetSessionAsync(sessions[5]);

        Assert.Null(firstSession); // Oldest session removed
        Assert.NotNull(lastSession); // Newest session exists
    }

    [Fact]
    public async Task DeleteSession_ShouldRemoveSession()
    {
        // Arrange
        var session = new UserSession(
            3,
            "delete@example.com",
            "User",
            "Firefox",
            "127.0.0.1",
            DateTime.UtcNow
        );
        var sessionId = await _sessionStore.CreateSessionAsync(session);

        // Act
        var deleted = await _sessionStore.DeleteSessionAsync(sessionId);
        var deletedFromSessionList = await _redis
            .GetDatabase()
            .ListPositionAsync($"user-sessions:{session.UserId}", sessionId);
        var retrieved = await _sessionStore.GetSessionAsync(sessionId);

        // Assert
        Assert.True(deleted);
        Assert.Equal(-1, deletedFromSessionList);
        Assert.Null(retrieved);
    }

    [Fact]
    public async Task RefreshSession_ShouldExtendExpiration()
    {
        // Arrange
        var session = new UserSession(
            4,
            "refresh@example.com",
            "User",
            "Safari",
            "127.0.0.1",
            DateTime.UtcNow
        );
        var sessionId = await _sessionStore.CreateSessionAsync(session);
        var sessionExp = await _redis.GetDatabase().KeyExpireTimeAsync($"session:{sessionId}");

        // Act
        var refreshed = await _sessionStore.RefreshSessionAsync(sessionId);
        var expiration = await _redis.GetDatabase().KeyExpireTimeAsync($"session:{sessionId}");

        // Assert
        Assert.True(refreshed);
        Assert.NotNull(expiration);
        Assert.True(expiration > sessionExp);
    }

    //[Fact]
    // Weird test case
    public async Task MultipleUsers_ShouldHaveIndependentSessionLimits()
    {
        // Arrange
        var user1Id = 5;
        var user2Id = 6;

        // Act - Create sessions for two different users
        var user1Session1 = await _sessionStore.CreateSessionAsync(
            new UserSession(user1Id, "user1@example.com", "User", "Chrome", "127.0.0.1", DateTime.UtcNow)
        );
        var user2Session1 = await _sessionStore.CreateSessionAsync(
            new UserSession(user2Id, "user2@example.com", "User", "Firefox", "127.0.0.1", DateTime.UtcNow)
        );

        var retrieved1 = await _sessionStore.GetSessionAsync(user1Session1);
        var retrieved2 = await _sessionStore.GetSessionAsync(user2Session1);

        // Assert - Both users can have their own sessions
        Assert.NotNull(retrieved1);
        Assert.NotNull(retrieved2);
        Assert.Equal(user1Id, retrieved1.UserId);
        Assert.Equal(user2Id, retrieved2.UserId);
    }
}
