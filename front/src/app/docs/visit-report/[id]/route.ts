import { reports } from "@/lib/actions";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const visitId = (await params).id;

  const pdf = await reports.reportVisit(visitId);

  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="visit-${visitId}.pdf"`,
    },
  });
}
