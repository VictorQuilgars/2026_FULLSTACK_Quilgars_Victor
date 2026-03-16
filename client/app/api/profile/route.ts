import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { API_URL } from "@/lib/config";

export async function PATCH(request: Request) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Utilisateur non authentifié." },
      { status: 401 },
    );
  }

  const { token } = await auth0.getAccessToken({ refresh: true });
  const body = await request.json();

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
