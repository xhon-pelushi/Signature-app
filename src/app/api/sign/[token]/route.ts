import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";

// GET - Load signer data
export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params;

    // Find the signer link by token
    const signerLink = await prisma.signerLink.findUnique({
      where: { token },
      include: {
        request: {
          include: {
            document: true,
            requester: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!signerLink) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 404 });
    }

    // Check if already signed
    if (signerLink.signedAt) {
      return NextResponse.json({ message: "Document already signed" }, { status: 410 });
    }

    // Check if request is cancelled
    if (signerLink.request.status === "CANCELED") {
      return NextResponse.json({ message: "This signature request was cancelled" }, { status: 410 });
    }

    // Return signer data
    return NextResponse.json({
      id: signerLink.id,
      signerEmail: signerLink.signerEmail,
      signerName: signerLink.signerName,
      signedAt: signerLink.signedAt,
      request: {
        title: signerLink.request.title,
        status: signerLink.request.status,
        requester: {
          name: signerLink.request.requester.name,
          email: signerLink.request.requester.email,
        },
        document: {
          name: signerLink.request.document.name,
          filePath: signerLink.request.document.filePath,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching signer data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST - Submit signature
export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params;
    const { signatureDataUrl } = await req.json();

    if (!signatureDataUrl) {
      return NextResponse.json({ message: "Signature data required" }, { status: 400 });
    }

    // Find the signer link
    const signerLink = await prisma.signerLink.findUnique({
      where: { token },
      include: {
        request: {
          include: {
            document: true,
            requester: true,
            signerLinks: true,
          },
        },
      },
    });

    if (!signerLink) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 404 });
    }

    // Check if already signed
    if (signerLink.signedAt) {
      return NextResponse.json({ message: "Document already signed" }, { status: 400 });
    }

    // Update signer link with signature timestamp
    await prisma.signerLink.update({
      where: { id: signerLink.id },
      data: {
        signedAt: new Date(),
      },
    });

    // TODO: Store the signature data (signatureDataUrl) securely
    // In a production app, you would:
    // 1. Store the signature image in S3/R2
    // 2. Update the document with the signature
    // 3. Generate a new version of the PDF with the signature embedded

    // Check if all signers have signed
    const allSignerLinks = signerLink.request.signerLinks;
    const allSigned = allSignerLinks.every((link) => link.id === signerLink.id || link.signedAt);

    // Update request status
    let newStatus = signerLink.request.status;
    if (allSigned) {
      newStatus = "COMPLETED";
    } else if (signerLink.request.status === "SENT") {
      newStatus = "PARTIALLY_SIGNED";
    }

    await prisma.signatureRequest.update({
      where: { id: signerLink.request.id },
      data: { status: newStatus },
    });

    // Send notifications
    try {
      const settings = await prisma.settings.findFirst({ where: { id: 1 } });
      const orgName = settings?.orgName || "SignatureApp";

      // Notify the requester
      const requesterEmail = signerLink.request.requester.email;
      const requesterName = signerLink.request.requester.name || requesterEmail;
      
      if (allSigned) {
        // All signatures complete
        await sendMail(
          requesterEmail,
          `[${orgName}] Document Fully Signed: ${signerLink.request.title}`,
          `
          <div style="font-family: Inter, system-ui, sans-serif; background:#f7fafc; padding:24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden;">
              <tr>
                <td style="padding:24px;">
                  <h2 style="color:#1a202c; margin:0 0 16px;">Document Fully Signed</h2>
                  <p style="color:#2d3748; margin:0 0 12px;">Hi ${requesterName},</p>
                  <p style="color:#2d3748; margin:0 0 16px;">
                    Good news! All required signatures have been collected for <strong>${signerLink.request.title}</strong>.
                  </p>
                  <p style="color:#2d3748; margin:0 0 16px;">
                    You can now download the completed document from your dashboard.
                  </p>
                  <div style="text-align:center; margin:24px 0;">
                    <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px;">View Dashboard</a>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          `
        );
      } else {
        // Partial signature notification
        await sendMail(
          requesterEmail,
          `[${orgName}] Signature Received: ${signerLink.request.title}`,
          `
          <div style="font-family: Inter, system-ui, sans-serif; background:#f7fafc; padding:24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden;">
              <tr>
                <td style="padding:24px;">
                  <h2 style="color:#1a202c; margin:0 0 16px;">Signature Received</h2>
                  <p style="color:#2d3748; margin:0 0 12px;">Hi ${requesterName},</p>
                  <p style="color:#2d3748; margin:0 0 16px;">
                    <strong>${signerLink.signerName || signerLink.signerEmail}</strong> has signed <strong>${signerLink.request.title}</strong>.
                  </p>
                  <p style="color:#2d3748; margin:0 0 16px;">
                    Waiting for ${allSignerLinks.filter((l) => !l.signedAt && l.id !== signerLink.id).length} more signature(s).
                  </p>
                </td>
              </tr>
            </table>
          </div>
          `
        );
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Document signed successfully",
      completed: allSigned,
    });
  } catch (error) {
    console.error("Error submitting signature:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


