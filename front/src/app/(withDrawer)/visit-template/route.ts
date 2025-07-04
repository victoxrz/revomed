import { decodeToken } from "@/lib/dal";
import { VisitTemplate } from "@/lib/definitions";
import { fetchGet } from "@/lib/fetchWrap";

export async function GET() {
  const payload = await decodeToken();
  if (!payload) return;
  console.log("hit-route-handler");

  const response = await fetchGet<VisitTemplate>(
    `/templates/get/${payload.templateId}`,
    {
      withAuth: true,
    }
  );

  if (response.data) {
    return Response.json(response.data);
  } else {
    console.error("Error fetching visit template: ", response.message);
  }
}
