import { type NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
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

    // Get stored OTP
    const storedData = await kv.get(`otp:${phoneNumber}`);

    if (!storedData) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      );
    }

    const { otp: storedOtp, expiresAt, verified } = storedData as any;

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

    // Mark OTP as verified
    await kv.set(
      `otp:${phoneNumber}`,
      {
        ...storedData,
        verified: true,
      },
      { ex: 600 }
    ); // Keep for 10 more minutes

    // Create user if not exists
    const userId = uuidv4();
    const user = {
      id: userId,
      name,
      phoneNumber,
      hasUsedService: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${phoneNumber}`, user);

    // Generate session token
    const sessionToken = uuidv4();
    await kv.set(
      `session:${sessionToken}`,
      { userId, phoneNumber },
      { ex: 86400 }
    ); // 24 hours expiration

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
