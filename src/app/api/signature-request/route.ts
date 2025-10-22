import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { buildSignatureRequestEmail } from "@/lib/emailTemplates";
import { exportWithFields } from "@/lib/exportWithFields";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { documentTitle, signerEmail, signerName, fields, documentData } = await req.json();

    if (!documentTitle || !signerEmail || !fields || !documentData) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Get settings for email configuration
    const settings = await prisma.settings.findFirst({ where: { id: 1 } });
    if (!settings?.initialized) {
      return NextResponse.json({ message: "App not configured" }, { status: 400 });
    }

    // Create or find user
    let user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email,
          passwordHash: "temp-hash", // In a real app, you'd handle proper authentication
        },
      });
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        name: documentTitle,
        filePath: `temp/${Date.now()}-${documentTitle}`, // In a real app, you'd store the actual file
        uploadedBy: user.id,
      },
    });

    // Create a signature request record
    const signatureRequest = await prisma.signatureRequest.create({
      data: {
        title: documentTitle,
        documentId: document.id,
        requesterId: user.id,
        token: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    // Create signer link
    const signerLink = await prisma.signerLink.create({
      data: {
        requestId: signatureRequest.id,
        signerEmail,
        signerName,
        token: `sign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    // Generate the PDF with fields
    const documentBlob = await exportWithFields(
      new Blob([documentData], { type: "application/pdf" }),
      fields
    );

    // For now, we'll just send the email with a link to the sign page
    // In a real implementation, you'd store the PDF and provide a secure link
    const actionUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sign?token=${signerLink.token}`;

    const emailContent = buildSignatureRequestEmail({
      orgName: settings.orgName || "Signature App",
      recipientName: signerName,
      requesterName: session.user.name || session.user.email,
      documentTitle,
      actionUrl,
      supportEmail: settings.fromEmail || undefined,
    });

    // Send the email
    await sendMail(signerEmail, emailContent.subject, emailContent.html);

    return NextResponse.json({ 
      success: true, 
      message: "Signature request sent successfully",
      requestId: signatureRequest.id 
    });

  } catch (error) {
    console.error("Error sending signature request:", error);
    return NextResponse.json(
      { message: "Failed to send signature request" },
      { status: 500 }
    );
  }
}
