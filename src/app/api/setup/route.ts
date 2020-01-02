import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setupSchema } from "@/lib/schemas/setup";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = setupSchema.safeParse(json);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      return NextResponse.json({ message: "Invalid setup payload", issues }, { status: 400 });
    }
    const { orgName, fromEmail, smtpHost, smtpPort, smtpUser, smtpPass } = parsed.data;
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
