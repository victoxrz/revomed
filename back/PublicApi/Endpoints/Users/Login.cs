using AppCore.Interfaces.Repository;
using FluentValidation;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Mvc;
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

    public async Task<IResult> HandleAsync([FromForm] LoginRequest loginRequest, TokenProvider provider, IUserRepository repo)
    {
        var result = new LoginRequestValidator().Validate(loginRequest);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (System.Text.Json.JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        if (await repo.LoginAsync(loginRequest.Email, loginRequest.Password))
        {
            var token = provider.Create(loginRequest.Email);
            return TypedResults.Ok(new LoginResponse(token));
        }
        else
        {
            return TypedResults.Extensions.Error("Provided credentials are incorect", StatusCodes.Status401Unauthorized);
        }
    }
}