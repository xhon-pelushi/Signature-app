import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

export async function getTransport() {
  const settings = await prisma.settings.findFirst({ where: { id: 1 } });
  if (!settings?.smtpHost || !settings.smtpPort) throw new Error("SMTP not configured");
  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpPort === 465,
    auth: settings.smtpUser && settings.smtpPass ? { user: settings.smtpUser, pass: settings.smtpPass } : undefined,
  });
  return { transporter, from: settings.fromEmail || process.env.EMAIL_FROM };
}

export async function sendMail(to: string, subject: string, html: string) {
  const { transporter, from } = await getTransport();
  await transporter.sendMail({ from, to, subject, html });
}
