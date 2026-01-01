namespace AppCore.Interfaces.Services;

public interface ISessionStore
{
    Task<UserSession?> GetSessionAsync(string sessionId, CancellationToken ct = default);
    Task<string> CreateSessionAsync(UserSession session, CancellationToken ct = default);
    Task<bool> DeleteSessionAsync(string sessionId, CancellationToken ct = default);
    Task<bool> RefreshSessionAsync(string sessionId, CancellationToken ct = default);
}

public record UserSession(
    int UserId,
    string Email,
    string UserRole,
    string UserAgent,
    string IpAddress,
    DateTime CreatedAt
);
