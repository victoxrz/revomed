using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Infrastructure.Reports;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Endpoints.Addons;
using QuestPDF.Fluent;

namespace PublicApi.Endpoints.Reports;

public class MedicalReport : BaseEndpoint
{
    public override RouteHandlerBuilder Configure(IEndpointRouteBuilder app)
    {
        TypeAdapterConfig<Visit, VisitReportDocument.VisitData>.NewConfig()
            .Map(d => d.Titles, s => s.Template.Titles)
            .Map(d => d.Triage, s => s.Triage.Adapt<VisitReportDocument.TriageData>() ?? null)
            .Compile();

        return app.MapGet(Tag.ToLower() + "/medical/{id}", HandleAsync)
            .AllowAnonymous()
            .WithTags(Tag);

    }

    private async Task<IResult> HandleAsync([FromRoute] int id, IVisitRepository visitRepo, IPatientRepository patientRepo)
    {
        var patient = await patientRepo.GetByIdAsync(id);
        if (patient is null)
            return TypedResults.BadRequest();

        var visit = visitRepo.GetByPatientId(id);
        if (!visit.Any())
            return TypedResults.BadRequest();

        var pdf = new MedicalReportDocument(
            patient.Adapt<MedicalReportDocument.PatientData>(),
            visit.OrderByDescending(e => e.CreatedAt).ProjectToType<VisitReportDocument.VisitData>()
        ).GeneratePdf();

        return TypedResults.File(pdf, contentType: "application/pdf");
    }
}
