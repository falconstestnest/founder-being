import { z } from "zod";
import { dietaryOptions, startupStages } from "@/lib/retreats/kodaikanal-2026";

const urlOptional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined))
  .refine(
    (v) => !v || /^https?:\/\/.+/i.test(v),
    "Enter a valid URL starting with http:// or https://",
  );

export const applySchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform((e) => e.toLowerCase()),
    phone: z
      .string()
      .trim()
      .min(8)
      .max(20)
      .regex(/^[+\d][\d\s()-]{7,}$/, "Enter a valid mobile / WhatsApp number"),
    cityCountry: z.string().trim().min(2).max(120),
    companyName: z.string().trim().min(1).max(160),
    currentRole: z.string().trim().min(1).max(120),
    linkedinUrl: urlOptional,
    companyUrl: urlOptional,
    startupStage: z.enum(startupStages as unknown as [string, ...string[]]),
    motivation: z.string().trim().min(150).max(1500),
    desiredOutcome: z.string().trim().min(100).max(1000),
    founderContext: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    attendedBefore: z.enum(["yes", "no"]),
    referralSource: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    kochiTransport: z.enum(["yes", "no", "unsure"]),
    twinSharing: z.enum(["yes", "no"]),
    dietaryBasic: z
      .string()
      .optional()
      .transform((v) => (v && dietaryOptions.includes(v as (typeof dietaryOptions)[number]) ? v : undefined)),
    accessibilityBasic: z
      .string()
      .trim()
      .max(500)
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    termsAccepted: z
      .boolean()
      .refine((v) => v === true, { message: "You must accept the terms to apply." }),
    privacyAccepted: z
      .boolean()
      .refine((v) => v === true, { message: "Privacy consent is required." }),
    marketingConsent: z.boolean().optional().default(false),
    // Spam traps
    website: z.string().max(0).optional(),
    turnstileToken: z.string().optional(),
    retreatSlug: z.literal("kodaikanal-full-moon-2026"),
    utmSource: z.string().max(120).optional(),
    utmMedium: z.string().max(120).optional(),
    utmCampaign: z.string().max(120).optional(),
    referrer: z.string().max(500).optional(),
    idempotencyKey: z.string().uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.linkedinUrl && !data.companyUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide a LinkedIn URL or company website.",
        path: ["linkedinUrl"],
      });
    }
    if (data.twinSharing === "no") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Twin-sharing is required for this retreat cohort.",
        path: ["twinSharing"],
      });
    }
  });

export type ApplyInput = z.infer<typeof applySchema>;

/** Rough E.164: keep digits, ensure leading + if international-looking. */
export function toE164ish(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  const digits = cleaned.replace(/\D/g, "");
  // India default if 10-digit local
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

export function generateApplicationCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `FBK-26-${suffix}`;
}
