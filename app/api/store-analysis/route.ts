// app/api/store-analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis, db } from "@/lib/db";
import { users, analysisHistory } from "@/lib/db/schema";
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

    const { userId, phoneNumber } = session;

    // Get request data
    const { imageUrl, analysisData } = await request.json();

    if (!imageUrl || !analysisData) {
      return NextResponse.json(
        { error: "Image URL and analysis data are required" },
        { status: 400 }
      );
    }

    // Store analysis in PostgreSQL
    const [result] = await db
      .insert(analysisHistory)
      .values({
        userId,
        imageUrl,
        analysisData: JSON.stringify(analysisData),
        createdAt: new Date(),
      })
      .returning({ id: analysisHistory.id });

    // Mark user as having used the service
    await db
      .update(users)
      .set({
        hasUsedService: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      message: "Analysis stored successfully",
      analysisId: result.id,
    });
  } catch (error) {
    console.error("Error storing analysis:", error);
    return NextResponse.json(
      { error: "Failed to store analysis" },
      { status: 500 }
    );
  }
}
