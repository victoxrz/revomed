using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Templates;

public class Create : BaseEndpoint
{
    public record CreateRequest(string Name, List<List<string>> Titles, bool RequireTriage);

    public class CreateRequestValidator : AbstractValidator<CreateRequest>
    {
        public CreateRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(40);
            RuleFor(x => x.Titles).NotEmpty();
        }
    }

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPost(Tag.ToLower() + "/create", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Admin)
            .WithValidation<CreateRequest>()
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromBody] CreateRequest request, IVisitTemplateRepository repo)
    {
        if (!await repo.AddAsync(request.Adapt<VisitTemplate>()))
        {
            return TypedResults.BadRequest(new ErrorResponse("Template with this name already exists."));
        }

        return TypedResults.Created();
    }
}
