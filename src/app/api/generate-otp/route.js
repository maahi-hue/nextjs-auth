import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from '../../../lib/db';  // Import Prisma client
import nodemailer from "nodemailer";

// send OTP email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });
};

// 🟢 API Route Handler
export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const   expires_at = new Date(Date.now() + 10 * 60 * 1000);


        console.log(db.otps);  
        await db.otps.upsert({
            where: { email: email },
            update: {
                otp: otp,
                expires_at:   expires_at,
            },
            create: {
                email: email,
                otp: otp,
                expires_at: expires_at,
            },
        });

        await sendOtpEmail(email, otp);

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
