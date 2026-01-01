namespace PublicApi.Endpoints.Addons;

public abstract class BaseEndpoint
{
    public abstract RouteHandlerBuilder Configure(IEndpointRouteBuilder app);
    public string Tag
        => GetType().Namespace?
           .Split('.')
           .Last()
         ?? "Undefined";
}