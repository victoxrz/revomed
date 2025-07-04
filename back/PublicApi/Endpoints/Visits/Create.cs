using AppCore.Interfaces.Repository;
using Domain.Enums;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
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
            .RequireRoles(UserRole.Medic)
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
            return TypedResults.Extensions.Error("Try to log in again", StatusCodes.Status400BadRequest);

        var medic = await medicRepo.FindByEmailAsync(email);
        if (medic == null)
            return TypedResults.Extensions.Error("Try to log in again", StatusCodes.Status400BadRequest);

        var response = await visitRepo.AddAsync(new()
        {
            PatientId = request.PatientId,
            MedicId = medic.UserId,
            TemplateId = medic.TemplateId,
            Fields = request.Fields,
        });

        if (!response.IsSuccessful)
            return TypedResults.Extensions.Error(response.Error, StatusCodes.Status400BadRequest);

        return TypedResults.Created();
    }
}
