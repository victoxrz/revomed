using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using static Infrastructure.Reports.VisitReportDocument;

namespace Infrastructure.Reports;

public sealed class MedicalReportDocument : IDocument
{
    public record PatientData(
        string FirstName,
        string LastName,
        string Idnp,
        Domain.Enums.Gender Gender,
        DateOnly Birthday,
        string Phone,
        string StreetAddress,
        string Job,
        string InsurancePolicy
    );

    private readonly PatientData _patientData;
    private readonly IQueryable<VisitData> _visitData;

    public MedicalReportDocument(PatientData patientData, IQueryable<VisitData> visitData)
    {
        _patientData = patientData;
        _visitData = visitData;
    }

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.DefaultTextStyle(TextStyle.Default.FontFamily("Times New Roman").FontSize(11));
            page.Size(PageSizes.A4);
            page.Margin(20);

            page.Header().Element(ComposeHeader);

            page.Content()
                .PaddingVertical(8)
                .Column(col =>
                {
                    col.Item().Element(e => ComposeContent(e));

                    foreach (var visit in _visitData)
                    {
                        col.Item().PaddingVertical(8).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                        col.Item().Element(e => new VisitReportDocument(visit).ComposeContent(e));
                    }
                });

            page.Footer()
                .AlignCenter()
                .Text(x =>
                {
                    x.Span("Generated on ").SemiBold().FontSize(9);
                    x.Span(DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm 'UTC'")).FontSize(9);
                });
        });
    }

    private void ComposeContent(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().AlignCenter().Text("FIŞA MEDICALĂ A BOLNAVULUI DE AMBULATOR nr. ");
            col.Item().Text($"Numele: {_patientData.LastName}");
            col.Item().Text($"Prenumele: {_patientData.FirstName}");
            col.Item().Text($"IDNP: {_patientData.Idnp}");
            col.Item().Text($"Data naşterii: {_patientData.Birthday}");
            col.Item().Text($"Telefon: {_patientData.Phone}");
            col.Item().Text($"Adresa: {_patientData.StreetAddress}");
            col.Item().Text($"Locul de muncă, studii: {_patientData.Job}");
        });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem()
                .Column(column =>
                {
                    column.Item().Text("Ministerul Sănătăţii al Republicii Moldova").Bold();
                    column.Item().Text("denumirea instituţiei medico-sanitare");
                });
            row.RelativeItem()
                .Column(column =>
                {
                    column.Item().Text("DOCUMENTAŢIE MEDICALĂ");
                    column
                        .Item()
                        .Text(t =>
                        {
                            t.Span("Formular ");
                            t.Span("nr 025/e").Bold();
                        });
                    column
                        .Item()
                        .Text(t =>
                        {
                            t.Span("Aprobat de MSPS al RM ");
                            t.Span("nr. 828 din 31.10.2011").Bold();
                        });
                });
        });
    }
}
