import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    const response = await fetch(`${API_BASE_URL}/lab-config/seed`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error seeding config:", error);
    return NextResponse.json(
      { error: "Failed to seed configuration" },
      { status: 500 }
    );
  }
}
