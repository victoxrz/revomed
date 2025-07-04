import { fetchGet } from "@/lib/fetchWrap";
import { NextRequest } from "next/server";
import { VisitItem } from "../types";

export async function GET(req: NextRequest) {
  const response = await fetchGet<VisitItem[]>(
    `/visits/get?patientId=${req.nextUrl.searchParams.get("patientId")}`,
    {
      withAuth: true,
    }
  );

  if (response.data) {
    return Response.json(response.data);
  } else {
    console.error("Error fetching visit template: ", response.message);
    return Response.json([]);
  }
}
