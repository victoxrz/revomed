using AppCore.Interfaces.Repository;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using PublicApi.Endpoints.Addons;
using System.Security.Claims;

namespace PublicApi.Endpoints.Visits;

public class Create : BaseEndpoint
{
    public record CreateRequest(int PatientId, int TemplateId, string[] Fields);

    private class CreateRequestValidator : AbstractValidator<CreateRequest>
    {
        public CreateRequestValidator()
        {
            RuleFor(x => x.PatientId).GreaterThan(0);
            RuleFor(x => x.TemplateId).GreaterThan(0);
            RuleFor(x => x.Fields).NotEmpty();
            RuleForEach(x => x.Fields).NotEmpty();
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPost(Tag.ToLower() + "/create", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .RequireRoles(Domain.Enums.UserRole.Medic)
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromBody] CreateRequest request, HttpContext context, IVisitRepository visitRepo, IMedicRepository medicRepo)
    {
        var result = new CreateRequestValidator().Validate(request);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (System.Text.Json.JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        var email = context.User.FindFirstValue(JwtRegisteredClaimNames.Email);
        if (email == null)
            return TypedResults.BadRequest(new ErrorResponse("Try to log in again"));

        var medic = await medicRepo.FindByEmail(email).SingleOrDefaultAsync();
        if (medic == null)
            return TypedResults.BadRequest(new ErrorResponse("Try to log in again"));

        var response = await visitRepo.AddAsync(new()
        {
            PatientId = request.PatientId,
            MedicId = medic.Id,
            TemplateId = medic.TemplateId,
            Fields = request.Fields,
        });

        if (!response.IsSuccessful)
            return TypedResults.BadRequest(new ErrorResponse(response.Error));

        return TypedResults.Created();
    }
}
