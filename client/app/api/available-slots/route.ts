import { NextResponse } from "next/server";
import { API_URL } from "@/lib/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!date || !serviceId) {
    return NextResponse.json(
      { message: "Les paramètres date et serviceId sont obligatoires." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${API_URL}/available-slots?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`,
    { cache: "no-store" },
  );

  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
