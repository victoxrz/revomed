using AppCore.Interfaces.Repository;
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
    public record LoginRequest(string Email, string Password);
    public record LoginResponse(string Token);

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
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status400BadRequest)
            .WithTags(Tag);
    }

    private record UserDto(string Password, UserRole UserRole, int? TemplateId);

    public async Task<IResult> HandleAsync([FromForm] LoginRequest loginRequest, HashProvider hashProvider, TokenProvider tokenProvider, IUserRepository repo)
    {
        var result = new LoginRequestValidator().Validate(loginRequest);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (System.Text.Json.JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        // TODO: think about a way to remove useless joins
        var user = await repo.FindByEmail(loginRequest.Email).SingleOrDefaultAsync(e => new UserDto(e.Password, e.UserRole, (e.Medic == null) ? null : e.Medic.TemplateId));
        if (user == null)
        {
            return TypedResults.Extensions.Error("The user was not found", StatusCodes.Status404NotFound);
        }

        // TODO: i would incorporate this in login??
        if (!hashProvider.Verify(loginRequest.Password, user.Password))
        {
            return TypedResults.Extensions.Error("Provided credentials are incorect", StatusCodes.Status401Unauthorized);
        }

        var token = tokenProvider.Create(loginRequest.Email, user.UserRole, user.TemplateId);

        return TypedResults.Ok(new LoginResponse(token));
    }
}

