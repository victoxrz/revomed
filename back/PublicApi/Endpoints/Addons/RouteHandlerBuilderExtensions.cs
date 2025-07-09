using Domain.Enums;

namespace PublicApi.Endpoints.Addons;

public static class RouteHandlerBuilderExtensions
{
    public static RouteHandlerBuilder RequireRoles(this RouteHandlerBuilder builder, params UserRole[] roles)
    {
        var roleNames = roles
            .Select(r => r.ToString());

        return builder.RequireAuthorization(policy => policy.RequireClaim("role", roleNames));
    }
}
