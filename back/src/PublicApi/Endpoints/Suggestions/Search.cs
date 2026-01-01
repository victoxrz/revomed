using AppCore.Interfaces.Repository;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Suggestions;

public class Search : BaseEndpoint
{
    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapGet(Tag.ToLower() + "/{templateId}/{titlePath}/search", HandleAsync).WithTags(Tag);
    }

    private IResult HandleAsync(
        [FromRoute] int templateId,
        [FromRoute] string titlePath,
        [FromQuery] string q,
        IVisitSuggestionRepository repo
    )
    {
        // case insensitive search, remove diacritics, fuzzy, maybe run simmilarity when querying
        var results = repo.SearchByValueAsync(q, templateId, titlePath);
        return TypedResults.Ok(results);
    }
}
