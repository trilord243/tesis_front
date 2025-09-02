import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    
    const queryString = active ? `?active=${active}` : "";
    
    const authCookie = request.cookies.get("auth-token");
    
    const response = await fetch(`${API_BASE_URL}/product-types${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authCookie ? { Cookie: `auth-token=${authCookie.value}` } : {}),
        ...(authCookie ? { Authorization: `Bearer ${authCookie.value}` } : {}),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { message: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching product types:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authCookie = request.cookies.get("auth-token");

    const response = await fetch(`${API_BASE_URL}/product-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authCookie ? { Cookie: `auth-token=${authCookie.value}` } : {}),
        ...(authCookie ? { Authorization: `Bearer ${authCookie.value}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating product type:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}