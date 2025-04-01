// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis, db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp, name } = await request.json();

    if (!phoneNumber || !otp || !name) {
      return NextResponse.json(
        { error: "Phone number, OTP, and name are required" },
        { status: 400 }
      );
    }

    // Get stored OTP from Redis
    const storedData = await redis.get(`otp:${phoneNumber}`);

    if (!storedData) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      );
    }

    const { otp: storedOtp, expiresAt, verified } = storedData;

    // Check if OTP is already verified
    if (verified) {
      return NextResponse.json(
        { error: "OTP already verified" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (new Date(expiresAt) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Verify OTP
    if (otp !== storedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Mark OTP as verified in Redis
    await redis.set(
      `otp:${phoneNumber}`,
      {
        ...storedData,
        verified: true,
      },
      600
    ); // Keep for 10 more minutes

    // Check if user exists in PostgreSQL
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber))
      .limit(1);

    let userId;

    if (existingUsers.length === 0) {
      // Create new user in PostgreSQL
      const [newUser] = await db
        .insert(users)
        .values({
          name,
          phoneNumber,
          hasUsedService: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: users.id });

      userId = newUser.id;
    } else {
      userId = existingUsers[0].id;
    }

    // Generate session token
    const sessionToken = uuidv4();
    await redis.set(`session:${sessionToken}`, { userId, phoneNumber }, 86400); // 24 hours expiration

    return NextResponse.json({
      message: "OTP verified successfully",
      user: {
        id: userId,
        name,
        phoneNumber,
      },
      token: sessionToken,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
