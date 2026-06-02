using System.Security.Claims;
using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace PublicApi.Endpoints.Addons;

public static class ClaimsPrincipalExtensions
{
    // TODO: its not perfect, rethink, maybe access from claims roles
    // i consider Redis a valid source of truth =>
    // improve session management (logout, password change, email change)
    // maybe as a policy or some
    public static async Task<(int userId, IResult? error)> AuthorizeSelfAccessAsync(
        this ClaimsPrincipal claims,
        int requestedUserId,
        UserRole[] requiredRoles
    )
    {
        var userIdClaim = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        var roleClaim = claims.FindFirstValue(ClaimTypes.Role);

        if (userIdClaim is null || !int.TryParse(userIdClaim, out int userId))
            return (0, TypedResults.Unauthorized());

        if (!Enum.TryParse<UserRole>(roleClaim, out var role))
            return (0, TypedResults.Unauthorized());

        if (requiredRoles.Contains(role) && userId != requestedUserId)
            return (0, TypedResults.Forbid());

        return (userId, null);
    }
}
