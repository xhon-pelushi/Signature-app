import { setupSchema } from "@/lib/schemas/setup";

describe("setupSchema", () => {
  const base = {
    orgName: "My Org",
    fromEmail: "admin@example.com",
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpUser: "user",
    smtpPass: "pass",
  };

  it("parses valid payload", () => {
    const res = setupSchema.safeParse(base);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.smtpPort).toBe(587);
    }
  });

  it("coerces smtpPort from string and enforces range", () => {
    expect(setupSchema.safeParse({ ...base, smtpPort: "587" }).success).toBe(true);
    const low = setupSchema.safeParse({ ...base, smtpPort: 0 });
    expect(low.success).toBe(false);
    const high = setupSchema.safeParse({ ...base, smtpPort: 70000 });
    expect(high.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const res = setupSchema.safeParse({ ...base, fromEmail: "not-an-email" });
    expect(res.success).toBe(false);
  });

  it("requires orgName and smtpHost", () => {
    const res = setupSchema.safeParse({ ...base, orgName: "", smtpHost: "" });
    expect(res.success).toBe(false);
  });
});
