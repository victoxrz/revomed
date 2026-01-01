using System.Security.Claims;
using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Visits;

public class Create : BaseEndpoint
{
    public record CreateRequest(int PatientId, int TemplateId, SortedDictionary<string, string> Fields);

    public class CreateRequestValidator : AbstractValidator<CreateRequest>
    {
        public CreateRequestValidator()
        {
            RuleFor(x => x.PatientId).GreaterThan(0);
            RuleFor(x => x.Fields).NotEmpty();
            RuleFor(x => x.Fields)
                .Must(x => x.All(f => !string.IsNullOrEmpty(f.Value)))
                .WithMessage("Fields must not contain empty strings.");
        }
    }

    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        return app.MapPost(Tag.ToLower() + "/create", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic)
            .WithValidation<CreateRequest>()
            .WithTags(Tag);
    }

    // TODO: chaos in here, refactor this method
    // TODO: write integration test for this function, check multiple combinations for Fields key
    public async Task<IResult> HandleAsync(
        [FromBody] CreateRequest request,
        ClaimsPrincipal user,
        IVisitRepository visitRepo,
        IMedicRepository medicRepo
    )
    {
        var email = user.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return TypedResults.BadRequest(new ErrorResponse("Try to log in again"));

        var medic = await medicRepo.FindByEmail(email).SingleOrDefaultAsync();
        if (medic == null)
            return TypedResults.Forbid();

        var entity = request.Adapt<Visit>();
        entity.MedicId = medic.Id;

        var response = await visitRepo.AddAsync(entity);

        if (!response.IsSuccessful)
            return TypedResults.BadRequest(new ErrorResponse(response.Error));

        return TypedResults.Created();
    }
}
