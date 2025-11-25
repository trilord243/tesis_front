import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    const response = await fetch(`${API_BASE_URL}/lab-config/purposes`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching purposes:", error);
    return NextResponse.json(
      { error: "Failed to fetch purposes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/lab-config/purposes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating purpose:", error);
    return NextResponse.json(
      { error: "Failed to create purpose" },
      { status: 500 }
    );
  }
}
