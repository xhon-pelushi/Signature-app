import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import pkg from "../../../../package.json" assert { type: "json" };

export const dynamic = "force-dynamic"; // ensure this isn't statically cached

export async function GET() {
  // App status and optional DB reachability check
  let db = { ok: false as boolean, message: "" };
  try {
    await prisma.$queryRaw`SELECT 1`;
    db.ok = true;
  } catch (e) {
    db = { ok: false, message: e instanceof Error ? e.message : "DB check failed" };
  }

  const commit =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.COMMIT_SHA ||
    "unknown";

  // Additional health checks
  const memory = process.memoryUsage();
  const uptime = process.uptime();
  
  const body = {
    ok: true,
    env: process.env.NODE_ENV,
    version: (pkg as { version?: string }).version ?? "0.0.0",
    commit,
    time: new Date().toISOString(),
    db,
    system: {
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memory.heapUsed / 1024 / 1024),
        total: Math.round(memory.heapTotal / 1024 / 1024),
        rss: Math.round(memory.rss / 1024 / 1024),
      },
    },
  };

  const res = NextResponse.json(body);
  // Ensure no caching so the status is always fresh
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

// Optional: quick HEAD for uptime checks
export async function HEAD() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
