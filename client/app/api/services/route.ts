import { NextResponse } from "next/server";
import { API_URL } from "@/lib/config";

export async function GET() {
  const response = await fetch(`${API_URL}/services`, { cache: "no-store" });

  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
