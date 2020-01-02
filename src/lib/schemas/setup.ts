import { z } from "zod";

/**
 * Zod schema for first-run Setup wizard input.
 * - Coerces smtpPort to a number and validates port range
 * - Ensures a valid fromEmail
 */
export const setupSchema = z
  .object({
    orgName: z.string().min(1, { message: "Organization name is required" }),
    fromEmail: z.string().email({ message: "Valid from email is required" }),
    smtpHost: z.string().min(1, { message: "SMTP host is required" }),
    smtpPort: z.coerce.number().int({ message: "SMTP port must be an integer" }).min(1, { message: "SMTP port must be between 1 and 65535" }).max(65535, { message: "SMTP port must be between 1 and 65535" }),
    smtpUser: z.string().optional(),
    smtpPass: z.string().optional(),
  })
  .strict();

export type SetupInput = z.infer<typeof setupSchema>;
