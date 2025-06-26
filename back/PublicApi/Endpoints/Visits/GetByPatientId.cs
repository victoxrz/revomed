using AppCore.Interfaces.Repository;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using System.Runtime.CompilerServices;

namespace PublicApi.Endpoints.Visits;

public class GetByPatientId : IEndpoint
{
    public record GetResponse(int PatientId, DateTime CreatedAt, string[] Fields);
    
    public void Configure(IEndpointRouteBuilder app)
    {
        var tag = SourceHelpers.GetSourceDirectory();
        app.MapGet(tag.ToLower() + "/get", HandleAsync)
            .RequireAuthorization()
            .WithTags(tag);
    }

    public IResult HandleAsync([FromQuery(Name = "patient_id")] int patientId, IVisitRepository repo)
    {
        var response = repo.GetByPatientId(patientId);
        if (!response.Any())
            return TypedResults.BadRequest();

        return TypedResults.Ok(response.ProjectToType<GetResponse>());
    }
}


// TODO: move or replace with code generation
public static class SourceHelpers
{
    /// <summary>
    /// Returns the directory of the .cs file where this method is *called*.
    /// </summary>
    public static string GetSourceDirectory([CallerFilePath] string sourceFilePath = "")
        => Path.GetFileName(Path.GetDirectoryName(sourceFilePath)) ?? throw new InvalidOperationException("Could not determine source directory");
}
