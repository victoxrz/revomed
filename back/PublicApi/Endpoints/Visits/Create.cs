using AppCore.Interfaces.Repository;
using Domain.Entities;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using System.Text.Json;

namespace PublicApi.Endpoints.Visits;

public class Create : IEndpoint
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

    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Visits.ToString();
        app.MapPost(tag.ToLower() + "/create", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .WithTags(tag);
    }

    public async Task<IResult> HandleAsync([FromBody] CreateRequest request, IVisitRepository repo)
    {
        var result = new CreateRequestValidator().Validate(request);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        var response = await repo.AddAsync(request.Adapt<Visit>());
        
        if (!response.IsSuccessful)
        {
            return TypedResults.Extensions.Error(response.Error, StatusCodes.Status400BadRequest);
        }
        return TypedResults.Created();
    }
}
