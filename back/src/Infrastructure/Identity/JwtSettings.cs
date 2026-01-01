namespace Infrastructure.Identity;

public record JwtSettings(string Secret, string Issuer, string Audience, int ExpiryMinutes);
