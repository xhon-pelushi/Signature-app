import { prisma } from "@/lib/db";

export async function getSettings() {
  try {
    return await prisma.settings.findFirst({ where: { id: 1 } });
  } catch {
    return null;
  }
}
