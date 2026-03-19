import { NextResponse } from "next/server";
import { API_URL } from "@/lib/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const excludeId = searchParams.get("excludeId");

  if (!date || !serviceId) {
    return NextResponse.json(
      { message: "Les paramètres date et serviceId sont obligatoires." },
      { status: 400 },
    );
  }

  const url = new URL(`${API_URL}/available-slots`);
  url.searchParams.set("date", date);
  url.searchParams.set("serviceId", serviceId);
  if (excludeId) url.searchParams.set("excludeId", excludeId);

  const response = await fetch(url.toString(), { cache: "no-store" });

  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
