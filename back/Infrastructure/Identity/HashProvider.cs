using Konscious.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Identity;

public class HashProvider(IConfiguration configuration)
{
    /// <summary>
    /// Hashes the provided password using the Argon2id algorithm.
    /// </summary>
    /// <param name="password">The plain text password to hash.</param>
    /// <returns>A <see cref="string"/> containing the salt and hashed password as a lowercase hexadecimal string.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="password"/> is <c>null</c>.</exception>
    /// <exception cref="EncoderFallbackException"> Thrown if the password encoding fails.</exception>
    public string Hash(string password)
    {
        var settings = configuration.GetSection(nameof(HashSettings)).Get<HashSettings>()!;

        var saltBytes = RandomNumberGenerator.GetBytes(settings.SaltSize);
        var argon = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Iterations = settings.Iterations,
            DegreeOfParallelism = settings.DegreeOfParallelism,
            MemorySize = settings.MemorySize,
            Salt = saltBytes
        };

        return Convert.ToHexStringLower([.. saltBytes, .. argon.GetBytes(settings.HashSize)]);
    }


    /// <summary>
    /// Verifies the provided password against the hashed password.
    /// </summary>
    /// <param name="password">The plain text password to verify.</param>
    /// <param name="hashedPassword">The hashed password in hex string format. This parameter must be a valid hex string.</param>
    /// <returns><see langword="true"/> if the password matches the hashed password; otherwise, <see langword="false"/>.</returns>
    /// <exception cref="FormatException">Thrown if the hashedPassword is not a valid hex string.</exception>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="EncoderFallbackException"></exception>
    public bool Verify(string password, string hashedPassword)
    {
        var settings = configuration.GetSection(nameof(HashSettings)).Get<HashSettings>()!;

        var argon = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Iterations = settings.Iterations,
            DegreeOfParallelism = settings.DegreeOfParallelism,
            MemorySize = settings.MemorySize,
            Salt = Convert.FromHexString(hashedPassword[..(settings.SaltSize * 2)])
        };

        var left = Convert.FromHexString(hashedPassword[(settings.SaltSize * 2)..]);
        var right = argon.GetBytes(settings.HashSize);

        return left.SequenceEqual(right);
    }
}
