using AppCore.Interfaces.Repository;
using Domain.Entities;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Visits;

public class Create : BaseEndpoint
{
    public record CreateRequest(int PatientId, int TemplateId, string[] Fields);

    private class CreateRequestValidator : AbstractValidator<CreateRequest>
    {
        public CreateRequestValidator()
        {
            RuleFor(x => x.PatientId).GreaterThan(0);
            RuleFor(x => x.Fields).NotEmpty();
            RuleForEach(x => x.Fields).NotEmpty();
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPost(Tag.ToLower() + "/create", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromBody] CreateRequest request, IVisitRepository repo)
    {
        var result = new CreateRequestValidator().Validate(request);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (System.Text.Json.JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        var response = await repo.AddAsync(request.Adapt<Visit>());

        if (!response.IsSuccessful)
        {
            return TypedResults.Extensions.Error(response.Error, StatusCodes.Status400BadRequest);
        }
        return TypedResults.Created();
    }
}
