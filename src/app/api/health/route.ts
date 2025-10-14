import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic"; // ensure this isn't statically cached

export async function GET() {
  // Simple health: app is up, and DB is reachable (optional)
  let db = { ok: false as boolean, message: "" };
  try {
    // Lightweight query touching the Settings table, if exists
    await prisma.$queryRaw`SELECT 1`;
    db.ok = true;
  } catch (e) {
    db = { ok: false, message: e instanceof Error ? e.message : "DB check failed" };
  }
  return NextResponse.json({ ok: true, env: process.env.NODE_ENV, db });
}
