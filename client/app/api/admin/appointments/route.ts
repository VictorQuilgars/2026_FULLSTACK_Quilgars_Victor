import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { API_URL } from "@/lib/config";

export async function GET() {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  const { token } = await auth0.getAccessToken({ refresh: true });

  const response = await fetch(`${API_URL}/admin/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
