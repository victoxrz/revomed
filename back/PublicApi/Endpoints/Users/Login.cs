using FluentValidation;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Login : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Users.ToString();
        app.MapPost(tag.ToLower() + "/login", HandleAsync)
            .DisableAntiforgery()
            .AllowAnonymous()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status400BadRequest)
            .WithTags(tag);
    }

    public Results<Ok<LoginResponse>, UnauthorizedHttpResult, JsonHttpResult<FluentValidation.Results.ValidationResult>> HandleAsync(
        [FromForm] LoginRequest loginRequest, TokenProvider provider)
    {
        var result = new LoginRequestValidator().Validate(loginRequest);
        if (!result.IsValid)
        {
            return TypedResults.Json(result, new System.Text.Json.JsonSerializerOptions(), null, StatusCodes.Status400BadRequest);
        }

        if (loginRequest.Email == "admin@admin.com" && loginRequest.Password == "adminadmin")
        {
            var token = provider.Create(loginRequest.Email);
            return TypedResults.Ok(new LoginResponse() { Token = token });
        }
        else
        {
            return TypedResults.Unauthorized();
        }
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginRequestValidator : AbstractValidator<LoginRequest>
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

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
}