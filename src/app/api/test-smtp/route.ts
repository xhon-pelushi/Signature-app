import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { testEmail } = await req.json();

    if (!testEmail) {
      return NextResponse.json({ message: "Test email address required" }, { status: 400 });
    }

    // Get settings for email configuration
    const settings = await prisma.settings.findFirst({ where: { id: 1 } });
    if (!settings?.initialized) {
      return NextResponse.json({ message: "App not configured" }, { status: 400 });
    }

    // Test email content
    const subject = `[${settings.orgName || "Signature App"}] SMTP Test Email`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">✅ SMTP Configuration Test</h2>
        <p>This is a test email to verify your SMTP settings are working correctly.</p>
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #0c4a6e;">Configuration Details:</h3>
          <ul style="margin: 0; color: #0c4a6e;">
            <li><strong>SMTP Host:</strong> ${settings.smtpHost}</li>
            <li><strong>SMTP Port:</strong> ${settings.smtpPort}</li>
            <li><strong>From Email:</strong> ${settings.fromEmail}</li>
            <li><strong>Organization:</strong> ${settings.orgName || "Not set"}</li>
          </ul>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          If you received this email, your SMTP configuration is working correctly! 
          You can now send signature requests through the Signature App.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          This is an automated test email from Signature App
        </p>
      </div>
    `;

    // Send the test email
    await sendMail(testEmail, subject, html);

    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully!",
      details: {
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        fromEmail: settings.fromEmail,
        orgName: settings.orgName
      }
    });

  } catch (error) {
    console.error("SMTP test error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to send test email";
    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        errorMessage = "SMTP authentication failed. Please check your username and password.";
      } else if (error.message.includes("connection")) {
        errorMessage = "Cannot connect to SMTP server. Please check your host and port settings.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "SMTP connection timed out. Please check your network and server settings.";
      } else {
        errorMessage = `SMTP Error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { 
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}


