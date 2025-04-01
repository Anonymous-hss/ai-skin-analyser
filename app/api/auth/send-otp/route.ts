// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis, db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// In a production app, you would use a proper SMS service like Twilio
// This is a mock implementation for demonstration purposes
async function sendSMS(phoneNumber: string, otp: string): Promise<boolean> {
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  // In a real implementation, you would call an SMS API here
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber || !phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number. Please use international format (e.g., +1234567890)",
        },
        { status: 400 }
      );
    }

    // Check if user has already used the service
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].hasUsedService) {
      return NextResponse.json(
        {
          error:
            "This phone number has already been used for skin analysis. Each number can only be used once.",
        },
        { status: 403 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await redis.set(
      `otp:${phoneNumber}`,
      {
        otp,
        expiresAt: expiresAt.toISOString(),
        verified: false,
      },
      600
    ); // 10 minutes expiration

    // Send OTP via SMS
    const sent = await sendSMS(phoneNumber, otp);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      // For development purposes only - remove in production
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
