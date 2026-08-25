import { Resend } from "resend";
import { budgetLabel, serviceLabel } from "@/content/contact";
import { site } from "@/content/site";
import type { ContactInput } from "./validation";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Best-effort notification. The sheet is the record of truth, so a mail failure
 * is logged by the caller and never fails the request.
 */
export async function sendEnquiryEmail(
  payload: ContactInput & { submittedAt: string },
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.CONTACT_TO_EMAILS ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from || to.length === 0) {
    throw new Error(
      "Resend is not configured (needs RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAILS)",
    );
  }

  const resend = new Resend(apiKey);

  const rows: Array<[string, string]> = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Company", payload.company || "—"],
    ["Interested in", serviceLabel(payload.service)],
    ["Budget", budgetLabel(payload.budget)],
    ["Received", payload.submittedAt],
  ];

  const text = [
    `New enquiry via ${site.name}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;background:#f4efe6;padding:28px;color:#1a1310">
      <div style="max-width:600px;margin:0 auto;background:#fbf8f3;border:1px solid #ddd3c6;border-radius:14px;overflow:hidden">
        <div style="background:#14100e;padding:20px 26px">
          <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e9b44c">
            ${escapeHtml(site.name)} — new enquiry
          </p>
          <p style="margin:8px 0 0;font-size:22px;color:#f0e9df">
            ${escapeHtml(payload.name)}
          </p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:11px 26px;border-bottom:1px solid #eee6da;color:#6b5b50;width:36%">
                ${escapeHtml(label)}
              </td>
              <td style="padding:11px 26px;border-bottom:1px solid #eee6da">
                ${escapeHtml(value)}
              </td>
            </tr>`,
            )
            .join("")}
        </table>
        <div style="padding:22px 26px">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#6b5b50">
            Message
          </p>
          <p style="margin:0;font-size:15px;line-height:1.65;white-space:pre-wrap">
            ${escapeHtml(payload.message)}
          </p>
        </div>
        <div style="padding:16px 26px;background:#f4efe6;border-top:1px solid #ddd3c6">
          <a href="mailto:${escapeHtml(payload.email)}"
             style="font-size:13px;color:#c2431c;text-decoration:none">
            Reply to ${escapeHtml(payload.name)} &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject: `New enquiry — ${payload.name} · ${serviceLabel(payload.service)}`,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
