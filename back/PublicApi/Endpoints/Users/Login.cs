using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Domain.Enums;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Login : BaseEndpoint
{
    private record LoginRequest(string Email, string Password);
    private record LoginResponse(string Token);

    private class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();
            RuleFor(x => x.Password)
                .NotEmpty();
        }
    }

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPost(Tag.ToLower() + "/login", HandleAsync)
            .DisableAntiforgery()
            .AllowAnonymous()
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromForm] LoginRequest loginRequest, HashProvider hashProvider, TokenProvider tokenProvider, IUserRepository repo)
    {
        var result = new LoginRequestValidator().Validate(loginRequest);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (System.Text.Json.JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        // test for significant perf improvment, if not remove
        // no perf boost, when selecting only needed fields
        var user = await repo.FindByEmail(loginRequest.Email).SingleOrDefaultAsync();
        if (user == null)
        {
            return TypedResults.NotFound(new ErrorResponse("The user was not found"));
        }

        if (!hashProvider.Verify(loginRequest.Password, user.Password))
        {
            return TypedResults.Unauthorized();
        }

        var token = tokenProvider.Create(loginRequest.Email, user.UserRole, (user as Medic)?.TemplateId);

        return TypedResults.Ok(new LoginResponse(token));
    }
}

