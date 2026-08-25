import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";
import { sendEnquiryEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  type ContactResponse,
  contactSchema,
  normalizeContact,
  toFieldErrors,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A real person takes longer than this to read the form and fill it in. */
const MIN_FILL_MS = 2500;

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function json(body: ContactResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "We could not read that submission." }, 400);
  }

  const { allowed, retryAfterSeconds } = checkRateLimit(clientIp(request));
  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `That is a few too many messages. Try again in ${Math.ceil(
          retryAfterSeconds / 60,
        )} minutes, or email us directly.`,
      } satisfies ContactResponse,
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const parsed = contactSchema.safeParse(normalizeContact(raw));
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "Some details need a second look.",
        fieldErrors: toFieldErrors(parsed.error),
      },
      422,
    );
  }

  const data = parsed.data;

  // Silent rejections: a bot that trips either check gets a success response so
  // it has no signal to iterate against.
  const tooFast =
    data.startedAt > 0 && Date.now() - data.startedAt < MIN_FILL_MS;
  if (data.website.length > 0 || tooFast) {
    console.warn("[contact] dropped a suspected bot submission", {
      honeypot: data.website.length > 0,
      tooFast,
    });
    return json({ ok: true }, 200);
  }

  const submittedAt = new Date().toISOString();

  try {
    await appendToSheet({
      ...data,
      submittedAt,
      source: request.headers.get("referer") ?? "direct",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });
  } catch (error) {
    console.error("[contact] sheet write failed", error);
    return json(
      {
        ok: false,
        error:
          "Something broke on our end and your message did not save. Please email us directly and we will pick it up.",
      },
      502,
    );
  }

  // The row is safely stored, so the notification is allowed to fail.
  try {
    await sendEnquiryEmail({ ...data, submittedAt });
  } catch (error) {
    console.error("[contact] notification email failed", error);
  }

  return json({ ok: true }, 200);
}

export function GET() {
  return NextResponse.json({ ok: true, message: "Contact endpoint is alive." });
}
