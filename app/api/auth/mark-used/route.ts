import { type NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Get session data
    const session = await kv.get(`session:${token}`);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const { phoneNumber } = session as any;

    // Get user data
    const userData = await kv.get(`user:${phoneNumber}`);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userData as any;

    // Check if user has already used the service
    if (user.hasUsedService) {
      return NextResponse.json(
        { error: "User has already used the service" },
        { status: 403 }
      );
    }

    // Mark user as having used the service
    await kv.set(`user:${phoneNumber}`, {
      ...user,
      hasUsedService: true,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "User marked as having used the service",
    });
  } catch (error) {
    console.error("Error marking user as used:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
