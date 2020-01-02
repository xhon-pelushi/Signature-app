export type SignatureRequestEmailInput = {
  orgName: string;
  recipientName?: string;
  requesterName?: string;
  documentTitle: string;
  actionUrl: string;
  supportEmail?: string;
};

export type EmailContent = {
  subject: string;
  html: string;
};

/**
 * Build the subject and HTML for a signature request email.
 * Keeps styling simple (inline CSS) for broad client compatibility.
 */
export function buildSignatureRequestEmail(input: SignatureRequestEmailInput): EmailContent {
  const {
    orgName,
    recipientName,
    requesterName,
    documentTitle,
    actionUrl,
    supportEmail,
  } = input;

  const subject = `[${orgName}] ${requesterName || "You"} requested your signature: ${documentTitle}`;
  const safeOrg = escapeHtml(orgName);
  const safeDoc = escapeHtml(documentTitle);
  const safeReq = escapeHtml(requesterName || "A colleague");
  const safeRec = recipientName ? escapeHtml(recipientName) : "there";
  const safeUrl = escapeAttribute(actionUrl);

  const html = `
  <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f7fafc; padding:24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
      <tr>
        <td style="padding:20px 24px; border-bottom:1px solid #edf2f7;">
          <div style="font-size:18px; font-weight:600; color:#1a202c;">${safeOrg}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 12px; font-size:16px; color:#1a202c;">Hi ${safeRec},</p>
          <p style="margin:0 0 16px; font-size:14px; color:#2d3748; line-height:1.55;">
            ${safeReq} has requested your signature on <strong>${safeDoc}</strong>.
          </p>
          <p style="margin:0 0 24px; font-size:14px; color:#4a5568;">
            To review and sign the document, click the button below.
          </p>
          <div style="text-align:center; margin:24px 0;">
            <a href="${safeUrl}" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600;">Review & Sign</a>
          </div>
          <p style="margin:0 0 8px; font-size:12px; color:#718096;">If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="margin:0 0 24px; font-size:12px; color:#4a5568; word-break:break-all;">
            <a href="${safeUrl}" style="color:#2563eb;">${safeUrl}</a>
          </p>
          <p style="margin:0; font-size:12px; color:#718096;">
            If you weren't expecting this request, you can safely ignore this email${supportEmail ? ", or contact us at " + escapeHtml(supportEmail) : ""}.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px; background:#f7fafc; border-top:1px solid #edf2f7; color:#718096; font-size:12px;">
          <div>&copy; ${new Date().getFullYear()} ${safeOrg}. All rights reserved.</div>
        </td>
      </tr>
    </table>
  </div>`;

  return { subject, html };
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(s: string): string {
  // Conservative: use HTML escaping for attributes
  return escapeHtml(s);
}
