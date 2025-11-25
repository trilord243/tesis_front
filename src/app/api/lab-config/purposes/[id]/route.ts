import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/lab-config/purposes/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating purpose:", error);
    return NextResponse.json(
      { error: "Failed to update purpose" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    const response = await fetch(
      `${API_BASE_URL}/lab-config/purposes/${params.id}`,
      {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting purpose:", error);
    return NextResponse.json(
      { error: "Failed to delete purpose" },
      { status: 500 }
    );
  }
}
