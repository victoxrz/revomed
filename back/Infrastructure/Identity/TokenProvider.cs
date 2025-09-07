using Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Identity;

public sealed class TokenProvider(IConfiguration configuration)
{
    // TODO: pass an object rather than properties when more than 1 prop
    public string Create(string email, UserRole role)
    {
        var settings = configuration.GetSection(nameof(JwtSettings)).Get<JwtSettings>()!;

        var claims = new ClaimsIdentity(
        [
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim("role", role.ToString()),
        ]);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = claims,
            // TIMESTAMP IN SECONDS!!!
            Expires = DateTime.UtcNow.AddMinutes(settings.ExpiryMinutes),

            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret)),
                SecurityAlgorithms.HmacSha256
            ),
            Issuer = settings.Issuer,
            Audience = settings.Audience
        };

        return new JsonWebTokenHandler().CreateToken(tokenDescriptor);
    }
}