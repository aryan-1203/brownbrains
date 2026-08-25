import type { ContactInput } from "./validation";
import { budgetLabel, serviceLabel } from "@/content/contact";

export type SheetPayload = ContactInput & {
  submittedAt: string;
  source: string;
  userAgent: string;
};

/**
 * Appends the enquiry to the Google Sheet through the Apps Script web app.
 * Apps Script always answers 200, so success is read from the JSON body.
 */
export async function appendToSheet(payload: SheetPayload) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SHARED_SECRET;

  if (!url) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    // text/plain avoids the CORS preflight that Apps Script rejects.
    body: JSON.stringify({
      secret,
      submittedAt: payload.submittedAt,
      name: payload.name,
      email: payload.email,
      company: payload.company,
      service: serviceLabel(payload.service),
      budget: budgetLabel(payload.budget),
      message: payload.message,
      source: payload.source,
      userAgent: payload.userAgent,
    }),
    signal: AbortSignal.timeout(9000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Sheet webhook responded ${response.status}`);
  }

  const raw = await response.text();

  let parsed: { ok?: boolean; error?: string };
  try {
    parsed = JSON.parse(raw) as { ok?: boolean; error?: string };
  } catch {
    throw new Error(`Sheet webhook returned a non-JSON body: ${raw.slice(0, 120)}`);
  }

  if (!parsed.ok) {
    throw new Error(parsed.error ?? "Sheet webhook rejected the submission");
  }
}
