using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Infrastructure.Reports;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using QuestPDF.Fluent;

namespace PublicApi.Endpoints.Reports;

public class VisitReport : BaseEndpoint
{
    public override void Configure(IEndpointRouteBuilder app)
    {
        app.MapGet(Tag.ToLower() + "/visits/{id}", HandleAsync)
            .AllowAnonymous()
            .WithTags(Tag);

        TypeAdapterConfig<Visit, VisitReportDocument.VisitData>.NewConfig()
            .Map(d => d.Titles, s => s.Template.Titles)
            .Map(d => d.Triage, s => s.Triage.Adapt<VisitReportDocument.TriageData>() ?? null)
            .Compile();
    }

    private IResult HandleAsync([FromRoute] int id, IVisitRepository repo)
    {
        var visit = repo.GetById(id);
        if (visit is null)
            return TypedResults.BadRequest();

        var pdf = new VisitReportDocument(visit.ProjectToType<VisitReportDocument.VisitData>().Single()).GeneratePdf();
        return TypedResults.File(pdf, contentType: "application/pdf");
    }
}
