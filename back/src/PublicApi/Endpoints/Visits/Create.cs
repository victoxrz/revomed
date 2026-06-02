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
    public record CreateRequest(int PatientId, int TemplateId, Dictionary<string, string> Fields);

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

    public async Task<IResult> HandleAsync(
        [FromBody] CreateRequest request,
        ClaimsPrincipal claims,
        IVisitRepository visitRepo,
        IMedicRepository medicRepo
    )
    {
        var email = claims.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return TypedResults.BadRequest(new ErrorResponse("Try to log in again"));

        var medicId = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(medicId, out var medicIdInt))
            return TypedResults.BadRequest(new ErrorResponse("Try to log in again"));

        var entity = request.Adapt<Visit>();
        entity.MedicId = medicIdInt;

        var response = await visitRepo.AddAsync(entity);

        if (!response.IsSuccessful)
            return TypedResults.BadRequest(new ErrorResponse(response.Error));

        return TypedResults.Created();
    }
}
