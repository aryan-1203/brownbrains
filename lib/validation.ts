import { z } from "zod";
import { budgetIds, serviceIds } from "@/content/contact";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the form and the route handler so both agree on what is valid. */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please tell us your name.")
    .max(80, "That name is longer than we can store."),
  email: z
    .string()
    .min(1, "We need an email to reply to.")
    .max(160, "That email is too long.")
    .regex(EMAIL, "That does not look like a valid email."),
  company: z.string().max(120, "Please shorten the company name."),
  service: z
    .string()
    .refine((value) => serviceIds.includes(value), "Pick the closest option."),
  budget: z
    .string()
    .refine((value) => budgetIds.includes(value), "Pick the closest range."),
  message: z
    .string()
    .min(20, "A couple of sentences helps us reply properly.")
    .max(2000, "Please keep it under 2000 characters."),

  /**
   * Left empty by humans, filled in by bots. Deliberately unconstrained here so
   * a filled honeypot never produces a validation error a bot could learn from —
   * the route handler drops it silently with a success response instead.
   */
  website: z.string(),
  /** Epoch ms when the form was rendered, used to reject instant submissions. */
  startedAt: z.number().int().nonnegative(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Trims and lowercases before validation so the client and the server never
 * disagree about whether " Name " is acceptable.
 */
export function normalizeContact(raw: Record<string, unknown>) {
  const text = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

  return {
    name: text(raw.name),
    email: text(raw.email).toLowerCase(),
    company: text(raw.company),
    service: text(raw.service),
    budget: text(raw.budget),
    message: text(raw.message),
    website: text(raw.website),
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : 0,
  };
}

/** Flattens a Zod error into the shape the form renders. */
export function toFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
