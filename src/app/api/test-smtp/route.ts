import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";

type SmtpTestResult = {
  success: boolean;
  message: string;
  details?: {
    smtpHost: string | null;
    smtpPort: number | null;
    fromEmail: string | null;
    orgName: string | null;
    testEmail: string;
  };
  error?: string;
};

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  return { session } as const;
}

async function getSettings() {
  const settings = await prisma.settings.findFirst({ where: { id: 1 } });
  if (!settings?.initialized) {
    return { error: NextResponse.json({ message: "App not configured" }, { status: 400 }) };
  }
  return { settings } as const;
}

function buildHtml(settings: { smtpHost: string | null; smtpPort: number | null; fromEmail: string | null; orgName: string | null }) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">✅ SMTP Configuration Test</h2>
        <p>This is a test email to verify your SMTP settings are working correctly.</p>
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #0c4a6e;">Configuration Details:</h3>
          <ul style="margin: 0; color: #0c4a6e;">
            <li><strong>SMTP Host:</strong> ${settings.smtpHost ?? "Unknown"}</li>
            <li><strong>SMTP Port:</strong> ${settings.smtpPort ?? "Unknown"}</li>
            <li><strong>From Email:</strong> ${settings.fromEmail ?? "Unknown"}</li>
            <li><strong>Organization:</strong> ${settings.orgName ?? "Not set"}</li>
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
}

function normalizeTargetEmail(testEmail: string | null | undefined, settingsEmail: string | null, sessionEmail: string | null | undefined) {
  if (testEmail && testEmail.trim()) return testEmail.trim();
  if (settingsEmail && settingsEmail.trim()) return settingsEmail.trim();
  if (sessionEmail && sessionEmail.trim()) return sessionEmail.trim();
  return null;
}

function mapError(error: unknown): SmtpTestResult {
  console.error("SMTP test error:", error);

  let errorMessage = "Failed to send test email";
  if (error instanceof Error) {
    const lower = error.message.toLowerCase();
    if (lower.includes("authentication")) {
      errorMessage = "SMTP authentication failed. Please check your username and password.";
    } else if (lower.includes("connection")) {
      errorMessage = "Cannot connect to SMTP server. Please check your host and port settings.";
    } else if (lower.includes("timeout")) {
      errorMessage = "SMTP connection timed out. Please check your network and server settings.";
    } else {
      errorMessage = `SMTP Error: ${error.message}`;
    }
  }

  return {
    success: false,
    message: errorMessage,
    error: error instanceof Error ? error.message : "Unknown error",
  };
}

async function sendSmtpTest(testEmail: string | null | undefined): Promise<NextResponse<SmtpTestResult>> {
  const { session, error: sessionError } = await requireSession();
  if (sessionError) {
    return sessionError;
  }

  const { settings, error: settingsError } = await getSettings();
  if (settingsError) {
    return settingsError;
  }

  const targetEmail = normalizeTargetEmail(testEmail, settings.fromEmail, session?.user?.email);
  if (!targetEmail) {
    return NextResponse.json({ success: false, message: "No target email available", error: "Missing target email" }, { status: 400 });
  }

  const subject = `[${settings.orgName || "Signature App"}] SMTP Test Email`;
  const html = buildHtml(settings);

  try {
    await sendMail(targetEmail, subject, html);
    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      details: {
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        fromEmail: settings.fromEmail,
        orgName: settings.orgName,
        testEmail: targetEmail,
      },
    });
  } catch (error) {
    const result = mapError(error);
    return NextResponse.json(result, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  return sendSmtpTest(email);
}

export async function POST(req: Request) {
  let testEmail: string | null | undefined;
  try {
    const payload = await req.json();
    testEmail = payload?.testEmail;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
  }

  return sendSmtpTest(testEmail);
}


