using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Identity;

public sealed class TokenProvider(IConfiguration configuration)
{
    // TODO: pass an object rather than properties
    public string Create(string email)
    {
        var settings = configuration.GetSection(nameof(JwtSettings)).Get<JwtSettings>()!;
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(JwtRegisteredClaimNames.Email, email)
            ]),
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