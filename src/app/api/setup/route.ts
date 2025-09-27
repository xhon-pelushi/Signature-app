import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orgName, fromEmail, smtpHost, smtpPort, smtpUser, smtpPass }: {
      orgName?: string;
      fromEmail?: string;
      smtpHost?: string;
      smtpPort?: number | string;
      smtpUser?: string;
      smtpPass?: string;
    } = body ?? {};
    if (!orgName || !fromEmail || !smtpHost || !smtpPort) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    try {
      await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        initialized: true,
        orgName,
        fromEmail,
        smtpHost,
        smtpPort: Number(smtpPort),
        smtpUser,
        smtpPass,
      },
      create: {
        id: 1,
        initialized: true,
        orgName,
        fromEmail,
        smtpHost,
        smtpPort: Number(smtpPort),
        smtpUser,
        smtpPass,
      },
      });
    } catch {
      // DB might not be set up yet; ignore and continue with cookie-based gating
    }
    const res = NextResponse.json({ ok: true });
    res.headers.append(
      "Set-Cookie",
      `app_initialized=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`,
    );
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Setup failed";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
