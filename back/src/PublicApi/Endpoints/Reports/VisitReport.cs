using System.Security.Claims;
using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Domain.Enums;
using Infrastructure.Reports;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using QuestPDF.Fluent;

namespace PublicApi.Endpoints.Reports;

public class VisitReport : BaseEndpoint
{
    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        TypeAdapterConfig<Visit, VisitReportDocument.VisitData>
            .NewConfig()
            .Map(d => d.Titles, s => s.Template.Titles)
            .Map(d => d.Triage, s => s.Triage.Adapt<VisitReportDocument.TriageData>() ?? null)
            .Compile();

        return app.MapGet(Tag.ToLower() + "/visits/{id}", HandleAsync)
            .RequireAuthorization()
            .RequireRoles(UserRole.Medic, UserRole.Patient)
            .WithTags(Tag);
    }

    private async Task<IResult> HandleAsync([FromRoute] int id, IVisitRepository repo, ClaimsPrincipal claims)
    {
        var (_, error) = await claims.AuthorizeSelfAccessAsync(id, [UserRole.Patient]);
        if (error is not null)
            return error;

        var visit = repo.GetById(id);
        if (visit is null)
            return TypedResults.BadRequest();

        var pdf = new VisitReportDocument(
            visit.ProjectToType<VisitReportDocument.VisitData>().Single()
        ).GeneratePdf();
        return TypedResults.File(pdf, contentType: "application/pdf");
    }
}
