using Domain.Enums;
using FluentValidation;

namespace PublicApi.Endpoints.Addons;

public static class RouteHandlerBuilderExtensions
{
    public static RouteHandlerBuilder RequireRoles(this RouteHandlerBuilder builder, params UserRole[] roles)
    {
        var roleNames = roles
            .Select(r => r.ToString());

        return builder.RequireAuthorization(policy => policy.RequireClaim("role", roleNames));
    }

    /// <summary>
    /// Adds validation filter for the specified request type. The request to validate is selected by its index in the handler method parameters. Default is 0 (the first parameter).
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    /// <param name="builder"></param>
    /// <param name="argIndex"></param>
    /// <returns></returns>
    public static RouteHandlerBuilder WithValidation<TRequest>(this RouteHandlerBuilder builder, int argIndex = 0)
    {
        return builder.AddEndpointFilter(async (invocationContext, next) =>
        {
            var validator = invocationContext.HttpContext.RequestServices.GetRequiredService<IValidator<TRequest>>();
            var res = validator.ValidateAsync(invocationContext.GetArgument<TRequest>(argIndex));
            
            if (!res.Result.IsValid)
            {
                return TypedResults.BadRequest(res.Result.ToDictionary());
            }
            
            return await next(invocationContext);
        });
    }
}
