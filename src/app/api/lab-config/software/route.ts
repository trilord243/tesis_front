import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    const response = await fetch(`${API_BASE_URL}/lab-config/by-type/software`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching software:", error);
    return NextResponse.json(
      { error: "Failed to fetch software" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    const body = await request.json();

    // Añadir el type al body
    const configData = {
      ...body,
      type: "software",
    };

    const response = await fetch(`${API_BASE_URL}/lab-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(configData),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating software:", error);
    return NextResponse.json(
      { error: "Failed to create software" },
      { status: 500 }
    );
  }
}
