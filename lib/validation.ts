import { z } from "zod";
import { LEAD_SOURCES } from "@/lib/types";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d][\d\s()-]{6,}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((v) => (v ? v : null))
    .pipe(z.email("Please enter a valid email").nullable()),
  company: optionalText(120),
  city: optionalText(80),
  subject: optionalText(160),
  message: optionalText(2000),
  source: z.enum(LEAD_SOURCES).default("contact"),
  items: z
    .array(
      z.object({
        product_id: z.string().max(64).nullable(),
        name: z.string().max(160),
        slug: z.string().max(160).nullable().optional(),
        quantity: z.coerce.number().int().min(1).max(100000),
      }),
    )
    .max(50)
    .default([]),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Flatten zod issues into a { field: message } map for forms. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
