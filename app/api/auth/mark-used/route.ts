// app/api/auth/mark-used/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis, db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Get session data from Redis
    const session = await redis.get(`session:${token}`);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const { phoneNumber } = session;

    // Update user in PostgreSQL
    const result = await db
      .update(users)
      .set({
        hasUsedService: true,
        updatedAt: new Date(),
      })
      .where(eq(users.phoneNumber, phoneNumber))
      .returning({ id: users.id });

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
