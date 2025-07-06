﻿using AppCore.Interfaces.Repository;
using FluentValidation;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Users;

public class Signup : BaseEndpoint
{
    public record SignupRequest(string Email, string Password);
    public record SignupResponse(string Token);

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

    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapPost(Tag.ToLower() + "/signup", HandleAsync)
            .DisableAntiforgery()
            .AllowAnonymous()
            .WithTags(Tag);
    }

    public async Task<IResult> HandleAsync([FromForm] SignupRequest signupRequest, TokenProvider provider, IUserRepository repo)
    {
        var result = new SignupRequestValidator().Validate(signupRequest);
        if (!result.IsValid)
        {
            return TypedResults.Json(result.ToDictionary(), (System.Text.Json.JsonSerializerOptions?)null, null, StatusCodes.Status400BadRequest);
        }

        if (await repo.SignupAsync(signupRequest.Email, signupRequest.Password))
        {
            var token = provider.Create(signupRequest.Email, Domain.Enums.UserRole.Patient);
            return TypedResults.Ok(new SignupResponse(token));
        }
        else
        {
            return TypedResults.BadRequest(new ErrorResponse("The provided email is already associated with an account"));
        }
    }
}