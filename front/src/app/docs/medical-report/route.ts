import { reports } from "@/lib/actions";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get("patientId");
  if (!patientId) return notFound();

  const pdf = await reports.reportMedical(Number(patientId));

  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="medical-${patientId}.pdf"`,
    },
  });
}
