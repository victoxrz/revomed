using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class Update : BaseEndpoint
{
    public record UpdateRequest(string Name, List<List<string>> Titles, bool RequireTriage);

    public class UpdateRequestValidator : AbstractValidator<UpdateRequest>
    {
        public UpdateRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(40);
            RuleFor(x => x.Titles).NotEmpty();
        }
    }

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPut(Tag.ToLower() + "/update/{id}", HandleAsync)
            .WithValidation<UpdateRequest>()
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromBody] UpdateRequest request, [FromRoute] int id, IVisitTemplateRepository repo)
    {
        var entity = request.Adapt<VisitTemplate>();
        entity.Id = id;

        if (!await repo.UpdateAsync(entity))
        {
            return TypedResults.BadRequest(new ErrorResponse("This template is in use."));
        }

        return TypedResults.Ok(request);
    }
}
