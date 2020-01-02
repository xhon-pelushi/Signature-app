import { buildSignatureRequestEmail } from "@/lib/emailTemplates";

describe("emailTemplates", () => {
  it("builds a signature request email with safe escaping", () => {
    const { subject, html } = buildSignatureRequestEmail({
      orgName: "Acme <Inc>",
      recipientName: "Eve & Co",
      requesterName: "Alice",
      documentTitle: "NDA > Confidential",
      actionUrl: "https://example.com/sign?token=abc&next=1",
      supportEmail: "support@example.com",
    });
    expect(subject).toMatch(/\[Acme/);
  expect(subject).toMatch(/requested your signature/);
    expect(html).toMatch(/Acme &lt;Inc&gt;/);
    expect(html).toMatch(/Hi Eve &amp; Co/);
    expect(html).toMatch(/NDA &gt; Confidential/);
    expect(html).toMatch(/https:\/\/example.com\/sign\?token=abc&amp;next=1/);
  });
});
