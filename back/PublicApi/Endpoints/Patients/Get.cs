using Microsoft.AspNetCore.Http.HttpResults;
using PublicApi.Endpoints.Addons;

namespace PublicApi.Endpoints.Patients;

public class Get : IEndpoint
{
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = EndpointTags.Patients.ToString();
        app.MapGet(tag.ToLower() + "/get", HandleAsync)
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithTags(tag);
    }
    public Ok<List<GetResponse>> HandleAsync()
    {
        return TypedResults.Ok(new List<GetResponse>()
        {
            new()
            {
                Id = 1,
                LastName = "Doe",
                FirstName = "John",
                DateOfBirth = DateTime.Now.Date,
                Gender = "M",
                Phone = "123456789"
            },
            new()
            {
                Id = 2,
                LastName = "Doe",
                FirstName = "John",
                DateOfBirth = DateTime.Now.Date,
                Gender = "M",
                Phone = "123456789"
            },
            new()
            {
                Id = 3,
                LastName = "Doe",
                FirstName = "John",
                DateOfBirth = DateTime.Now.Date,
                Gender = "M",
                Phone = "123456789"
            }
        });
    }
}

public class GetResponse
{
    public required int Id { get; set; }
    public required string LastName { get; set; } = string.Empty;
    public required string FirstName { get; set; } = string.Empty;
    public required DateTime DateOfBirth { get; set; }
    public required string Gender { get; set; } = string.Empty;
    public required string Phone { get; set; } = string.Empty;
}
