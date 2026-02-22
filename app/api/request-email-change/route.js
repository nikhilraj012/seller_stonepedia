
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import admin from "./firebaseAdmin";

export async function POST(req) {
    try {
        const { uid, newEmail } = await req.json();

        if (!newEmail || !newEmail.includes("@")) {
            return NextResponse.json({ message: "Invalid email" }, { status: 400 });
        }

        // ✅ Get user by UID instead of email
        const user = await admin.auth().getUser(uid);

        // Generate verify-and-change link
        const firebaseLink = await admin.auth().generateVerifyAndChangeEmailLink(
            user.email,      // can be dummy email
            newEmail,
            { url: process.env.NEXT_PUBLIC_APP_URL, handleCodeInApp: false }
        );

        // Extract oobCode and send email
        const oobCodeMatch = firebaseLink.match(/oobCode=([^&]+)/);
        if (!oobCodeMatch) throw new Error("OOB code not found");
        const oobCode = oobCodeMatch[1];
        const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/confirm-email-change?oobCode=${encodeURIComponent(oobCode)}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
        });

        await transporter.sendMail({
            from: `Stonepedia <${process.env.GMAIL_USER}>`,
            to: newEmail,
            subject: "Verify your new email",
            html: `<h3>Email change request</h3>
             <p>Click below to confirm your new email:</p>
             <a href="${confirmLink}" style="display:inline-block;padding:10px 14px;background:#000;color:#fff;border-radius:6px;text-decoration:none">Verify Email</a>`
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("request-email-change error:", err);
        return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
    }
}