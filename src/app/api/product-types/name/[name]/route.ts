import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  try {
    const authCookie = request.cookies.get("auth-token");

    const response = await fetch(
      `${API_BASE_URL}/product-types/name/${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authCookie ? { Cookie: `auth-token=${authCookie.value}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching product type by name:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}