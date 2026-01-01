using System.Text.Json;
using AppCore.Interfaces.Services;
using Infrastructure.Configuration;
using StackExchange.Redis;

namespace Infrastructure.Handlers;

// TODO: remove cancelation tokens where not needed
public class RedisSessionStore : ISessionStore
{
    private readonly IConnectionMultiplexer _redis;
    private readonly TimeSpan _sessionExpiration = TimeSpan.FromDays(7);
    private const string SessionKeyPrefix = "session:";
    private const string UserSessionsKeyPrefix = "user-sessions:";
    private const int MaxSessionsPerUser = 5;

    public RedisSessionStore(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<UserSession?> GetSessionAsync(string sessionId, CancellationToken ct = default)
    {
        var db = _redis.GetDatabase();
        var key = SessionKeyPrefix + sessionId;
        string? sessionData = await db.StringGetAsync(key);

        if (string.IsNullOrEmpty(sessionData))
            return null;

        return JsonSerializer.Deserialize<UserSession>(sessionData, JsonConfiguration.CamelCaseOptions);
    }

    // TODO: review this, maybe another exception to be thrown
    public async Task<string> CreateSessionAsync(UserSession session, CancellationToken ct = default)
    {
        var db = _redis.GetDatabase();
        var sessionId = Guid.NewGuid().ToString("N");
        var sessionKey = SessionKeyPrefix + sessionId;
        var userSessionsKey = UserSessionsKeyPrefix + session.UserId;

        // Get existing user sessions
        var sessionDataLength = await db.ListLengthAsync(userSessionsKey);

        // Remove oldest session if at limit
        if (sessionDataLength >= MaxSessionsPerUser)
        {
            string? sessionToRemove = await db.ListRightPopAsync(userSessionsKey);
            if (sessionToRemove == null)
                throw new InvalidOperationException();

            await db.KeyDeleteAsync(SessionKeyPrefix + sessionToRemove);
        }

        // Store new session
        var sessionData = JsonSerializer.Serialize(session, JsonConfiguration.CamelCaseOptions);
        await db.StringSetAsync(sessionKey, sessionData, _sessionExpiration);

        // Add to user's session list
        await db.ListLeftPushAsync(userSessionsKey, sessionId);

        return sessionId;
    }

    // TODO: weird return, rethink
    public async Task<bool> DeleteSessionAsync(string sessionId, CancellationToken ct = default)
    {
        var db = _redis.GetDatabase();
        var key = SessionKeyPrefix + sessionId;
        var session = await GetSessionAsync(sessionId, ct);

        if (session != null)
        {
            // Remove from user's session list
            var userSessionsKey = UserSessionsKeyPrefix + session.UserId;
            await db.ListRemoveAsync(userSessionsKey, sessionId, 1);
        }

        return await db.KeyDeleteAsync(key);
    }

    public async Task<bool> RefreshSessionAsync(string sessionId, CancellationToken ct = default)
    {
        var db = _redis.GetDatabase();
        var key = SessionKeyPrefix + sessionId;
        var ok = await db.KeyExpireAsync(key, _sessionExpiration);

        return ok;
    }
}
