using Microsoft.AspNetCore.Http.HttpResults;
using System.Text.Json;

namespace PublicApi.Endpoints.Addons;

public record ErrorResponse(string? Message);
//public static class TypedResultsExtensions
//{

//    /// <summary>
//    /// Returns a <see cref="JsonHttpResult{ErrorResponse}"/> representing an error response.
//    /// </summary>
//    /// <param name="error">The error message to include in the response.</param>
//    /// <param name="statusCode">
//    /// The HTTP status code for the response. 
//    /// <b>Tip:</b> Prefer using the <see cref="StatusCodes"/> enum for standard status codes.
//    /// </param>
//    /// <param name="options">Optional <see cref="JsonSerializerOptions"/> for JSON serialization.</param>
//    /// <param name="contentType">Optional content type for the response.</param>
//    /// <returns>A <see cref="JsonHttpResult{ErrorResponse}"/> containing the error message.</returns>
//    public static JsonHttpResult<ErrorResponse> Error(this IResultExtensions _, string? error, int? statusCode = null, JsonSerializerOptions? options = null, string? contentType = null)
//    {
//        return TypedResults.Json<ErrorResponse>(new(error), options, contentType, statusCode);
//    }
//}
