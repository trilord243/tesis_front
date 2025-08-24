import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const authCookie = request.cookies.get("auth-token");

    const response = await fetch(
      `${API_BASE_URL}/product-types/${id}/tags`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authCookie ? { Cookie: `auth-token=${authCookie.value}` } : {}),
          ...(authCookie ? { Authorization: `Bearer ${authCookie.value}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding tags to product type:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const authCookie = request.cookies.get("auth-token");

    const response = await fetch(
      `${API_BASE_URL}/product-types/${id}/tags`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(authCookie ? { Cookie: `auth-token=${authCookie.value}` } : {}),
          ...(authCookie ? { Authorization: `Bearer ${authCookie.value}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error removing tags from product type:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}