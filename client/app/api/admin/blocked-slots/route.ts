import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { API_URL } from "@/lib/config";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ message: "Non authentifié." }, { status: 401 });

  const { token } = await auth0.getAccessToken({ refresh: true });
  const response = await fetch(`${API_URL}/admin/blocked-slots`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function POST(req: Request) {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ message: "Non authentifié." }, { status: 401 });

  const { token } = await auth0.getAccessToken({ refresh: true });
  const body = await req.json();
  const response = await fetch(`${API_URL}/admin/blocked-slots`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}
