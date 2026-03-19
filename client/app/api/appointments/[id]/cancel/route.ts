import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { API_URL } from "@/lib/config";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Utilisateur non authentifié." },
      { status: 401 },
    );
  }

  const { token } = await auth0.getAccessToken({ refresh: true });
  const { id } = await params;

  const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
