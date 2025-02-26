using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using System.Text.Json.Serialization;

namespace PublicApi.Endpoints.Patients;

public class Create : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Patients.ToString();
        app.MapPost(tag.ToLower() + "/create", HandleAsync)
            .DisableAntiforgery()
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .WithTags(tag);
    }

    public Ok<string> HandleAsync([FromForm] CreateRequest request)
    {
        return TypedResults.Ok("foarte bine");
    }

    public class CreateRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime Birthday { get; set; }
        public Gender Gender { get; set; }
    }

    // TODO: move from here
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Gender
    {
        Male,
        Female
    }
}
