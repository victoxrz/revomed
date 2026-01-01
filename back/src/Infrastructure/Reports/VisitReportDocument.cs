using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Infrastructure.Reports;

public sealed class VisitReportDocument : IDocument
{
    public record MedicData(string FirstName, string LastName, string Specialty);

    public record PatientData(
        string FirstName,
        string LastName,
        string Idnp,
        DateOnly Birthday,
        string StreetAddress,
        string Job
    );

    public record TriageData(
        float Temperature,
        int SystolicPressure,
        int DiastolicPressure,
        int HeartRate,
        int RespiratoryRate,
        float Weight,
        int Height,
        float WaistCircumference
    );

    public record VisitData(
        List<List<string>> Titles,
        SortedDictionary<string, string> Fields,
        DateTime CreatedAt,
        MedicData Medic,
        PatientData Patient,
        TriageData? Triage = null
    );

    private readonly VisitData _visitData;

    public VisitReportDocument(VisitData visitData)
    {
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
            page.Content().PaddingVertical(8).Element(ComposeContent);
            page.Footer().Element(ComposeFooter);
        });
    }

    private void ComposeFooter(IContainer footer)
    {
        footer.Column(col =>
        {
            col.Item()
                .AlignLeft()
                .Column(col =>
                {
                    col.Item().Text($"Date: {_visitData.CreatedAt}").FontSize(10);
                    col.Item()
                        .Row(r =>
                        {
                            r.AutoItem()
                                .Text(
                                    $"Medic: {_visitData.Medic.FirstName} {_visitData.Medic.LastName} ({_visitData.Medic.Specialty})"
                                )
                                .FontSize(12);
                            r.RelativeItem().AlignRight().Text($"Semnătură:").FontSize(12);
                            r.ConstantItem(200)
                                .AlignMiddle()
                                .AlignBottom()
                                .LineHorizontal(0.5f) // thickness in points
                                .LineColor(Colors.Black); // optional
                        });
                });

            col.Item()
                .PaddingTop(8)
                .AlignCenter()
                .Text(x =>
                {
                    x.Span("Generated on ").SemiBold().FontSize(9);
                    x.Span(DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm 'UTC'")).FontSize(9);
                });
        });
    }

    void ComposeHeader(IContainer header)
    {
        header.Row(row =>
        {
            row.RelativeItem()
                .Column(col =>
                {
                    col.Item().Text("Medical Visit Summary").Bold().FontSize(18);
                    col.Item()
                        .Text(
                            $"Numele, prenumele bolnavului: {_visitData.Patient.FirstName} {_visitData.Patient.LastName}"
                        )
                        .FontSize(12);
                    col.Item().Text($"Număr de identificare: {_visitData.Patient.Idnp}").FontSize(12);
                    col.Item().Text($"Data naşterii: {_visitData.Patient.Birthday}").FontSize(12);
                    col.Item().Text($"Adresa la domiciliu: {_visitData.Patient.StreetAddress}").FontSize(12);
                    col.Item()
                        .Text($"Locul de muncă (funcţia), studii: {_visitData.Patient.Job}")
                        .FontSize(12);
                });
        });
    }

    public void ComposeContent(IContainer content)
    {
        content.Column(col =>
        {
            col.Spacing(8);
            if (_visitData.Triage != null)
                col.Item().PaddingTop(12).Element(ComposeTriage);

            col.Item().Element(c => ComposeTemplate(c, _visitData.Titles, _visitData.Fields));
        });
    }

    void ComposeTemplate(
        IContainer container,
        List<List<string>> titles,
        SortedDictionary<string, string> fields
    )
    {
        container.Column(column =>
        {
            column.Spacing(8);

            var printedTitleForOuter = new HashSet<int>();
            foreach (var (key, val) in fields)
            {
                var idxs = key.Split("-").Select(int.Parse);

                column
                    .Item()
                    .Column(col =>
                    {
                        if (idxs.Last() > 0)
                        {
                            if (!printedTitleForOuter.Contains(idxs.First()))
                            {
                                col.Item().Text(titles[idxs.First()][0]).SemiBold();
                                printedTitleForOuter.Add(idxs.First());
                            }
                        }
                        col.Item()
                            .Element(e => idxs.Last() > 0 ? e.PaddingLeft(16) : e)
                            .Text(titles[idxs.First()][idxs.Last()])
                            .SemiBold();
                        col.Item().PaddingLeft(16).Text(val);
                    });
            }
        });
    }

    void ComposeTriage(IContainer container)
    {
        var t = _visitData.Triage!;
        container.Column(col =>
        {
            col.Item().Text("Triage Measurements").SemiBold();

            col.Item()
                .PaddingTop(6)
                .Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.ConstantColumn(200);
                        c.ConstantColumn(100);
                    });

                    void AddRow(string metric, string value)
                    {
                        table.Cell().Text(metric).SemiBold();
                        table.Cell().Text(value);
                    }

                    AddRow("Temperature (°C)", t.Temperature.ToString("F1"));
                    AddRow(
                        "Blood Pressure (systolic/diastolic)",
                        $"{t.SystolicPressure}/{t.DiastolicPressure} mmHg"
                    );
                    AddRow("Heart Rate (bpm)", t.HeartRate.ToString());
                    AddRow("Respiratory Rate (breaths/min)", t.RespiratoryRate.ToString());
                    AddRow("Weight (kg)", t.Weight.ToString("F1"));
                    AddRow("Height (cm)", t.Height.ToString());
                    AddRow("Waist Circumference (cm)", t.WaistCircumference.ToString("F1"));
                });
        });
    }
}
