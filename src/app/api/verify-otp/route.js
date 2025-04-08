import { NextResponse } from "next/server";
import { db } from '../../../lib/db'; 

export async function POST(req) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        const otpRecord = await db.otps.findUnique({
            where: { email: email },
        });

        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
            return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
        }


        await db.otps.delete({
            where: { email: email },
        });

        return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
