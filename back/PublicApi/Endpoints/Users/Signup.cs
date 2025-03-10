using AppCore.Interfaces.Repository;
using FluentValidation;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Signup : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Users.ToString();
        app.MapPost(tag.ToLower() + "/signup", HandleAsync)
            .DisableAntiforgery()
            .AllowAnonymous()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .WithTags(tag);
    }

    public async Task<Results<
        JsonHttpResult<List<FluentValidation.Results.ValidationFailure>>,
        BadRequest,
        Ok<SignupResponse>>>
        HandleAsync([FromForm] SignupRequest signupRequest, TokenProvider provider, IUserRepository repo)
    {
        var result = new SignupRequestValidator().Validate(signupRequest);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.Errors, new System.Text.Json.JsonSerializerOptions(), null, StatusCodes.Status400BadRequest);
        }

        var isSuccesful = await repo.SignupAsync(signupRequest.Email, signupRequest.Password);
        if (!isSuccesful)
            return TypedResults.BadRequest();

        var token = provider.Create(signupRequest.Email);
        return TypedResults.Ok(new SignupResponse() { Token = token });
    }

    public class SignupRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        //public string Username { get; set; } = string.Empty;

        //public static explicit operator User(SignupRequest request)
        //{
        //    return new User
        //    {
        //        Email = request.Email,
        //        Password = request.Password,

        //    };
        //}
    }

    private class SignupRequestValidator : AbstractValidator<SignupRequest>
    {
        public SignupRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();
            RuleFor(x => x.Password)
                .NotEmpty();
            //.MinimumLength(8)
        }
    }

    public class SignupResponse
    {
        public string Token { get; set; } = string.Empty;
    }
}