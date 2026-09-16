import "server-only";
import { Resend } from "resend";
import { env } from "./env";
import { escapeHtml, formatDate } from "./utils";
import { absoluteUrl } from "./site-url";
import type { Inquiry } from "./types";

function client(): Resend | null {
  return env.resendApiKey ? new Resend(env.resendApiKey) : null;
}

const wrap = (title: string, body: string, company: string) => `<!doctype html>
<html><body style="margin:0;background:#EDEEE8;font-family:Helvetica,Arial,sans-serif;color:#1E1B18">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff">
<tr><td style="padding:28px 32px;border-bottom:1px solid #D6D5CD;font-family:Georgia,serif;font-size:22px;color:#6B1F3A">${escapeHtml(company)}</td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:normal;font-size:26px">${escapeHtml(title)}</h1>${body}</td></tr>
</table></td></tr></table></body></html>`;

const row = (label: string, value?: string | number | null) =>
  value === undefined || value === null || value === ""
    ? ""
    : `<tr><td style="padding:6px 12px 6px 0;color:#5E5A54;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0">${escapeHtml(String(value))}</td></tr>`;

export async function sendInquiryEmails(inquiry: Inquiry, company: string, companyEmail?: string): Promise<{ admin: boolean; visitor: boolean }> {
  const resend = client();
  const result = { admin: false, visitor: false };
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set; skipping inquiry emails");
    return result;
  }
  const to = env.contactEmail ?? companyEmail;
  const dates =
    inquiry.arrivalDate || inquiry.departureDate
      ? `${formatDate(inquiry.arrivalDate) || "?"} – ${formatDate(inquiry.departureDate) || "?"}`
      : "";
  const interests = [...inquiry.interests, ...inquiry.experiences].join(", ");
  const adminLink = absoluteUrl(`/admin/inquiries/${inquiry._id}`);

  if (to) {
    const body = `<table role="presentation" style="font-size:15px;line-height:1.5">
${row("Name", inquiry.name)}${row("Email", inquiry.email)}${row("Phone", inquiry.phone)}${row("Country", inquiry.country)}
${row("Dates", dates)}${row("Travelers", inquiry.travelers)}${row("Destinations", inquiry.destinations.join(", "))}
${row("Interests", interests)}${row("Accommodation", inquiry.accommodationNeeded ? "Needed" : inquiry.type === "trip" ? "Not needed" : "")}
${row("Airport transfer", inquiry.airportTransferNeeded ? "Needed" : inquiry.type === "trip" ? "Not needed" : "")}
${row("Subject", inquiry.subject)}${row("Page", inquiry.sourcePath)}</table>
<p style="margin:24px 0 8px;color:#5E5A54">Message</p>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.6;border-left:3px solid #6B1F3A;padding-left:14px">${escapeHtml(inquiry.message)}</div>
<p style="margin:28px 0 0"><a href="${adminLink}" style="background:#6B1F3A;color:#fff;padding:12px 20px;text-decoration:none;display:inline-block">Open inquiry in admin</a></p>`;
    try {
      const { error } = await resend.emails.send({
        from: env.emailFrom,
        to,
        replyTo: inquiry.email,
        subject: `New ${inquiry.type === "trip" ? "trip inquiry" : "message"} from ${inquiry.name}${inquiry.country ? ` (${inquiry.country})` : ""}`,
        html: wrap(inquiry.type === "trip" ? "New trip inquiry" : "New contact message", body, company),
      });
      result.admin = !error;
      if (error) console.error("[email] admin notification failed", error);
    } catch (e) {
      console.error("[email] admin notification failed", e);
    }
  }

  const visitorBody = `<p style="font-size:16px;line-height:1.6">Dear ${escapeHtml(inquiry.name)},</p>
<p style="font-size:16px;line-height:1.6">Thank you for getting in touch. We have received your ${inquiry.type === "trip" ? "trip request" : "message"} and a member of our team will reply personally, usually within one business day.</p>
${inquiry.type === "trip" ? `<table role="presentation" style="font-size:15px;line-height:1.5;margin:16px 0">${row("Dates", dates)}${row("Travelers", inquiry.travelers)}${row("Destinations", inquiry.destinations.join(", "))}${row("Interests", interests)}</table>` : ""}
<p style="font-size:16px;line-height:1.6">If anything changes in the meantime, simply reply to this email.</p>
<p style="font-size:16px;line-height:1.6">Warm regards,<br>${escapeHtml(company)}</p>`;
  try {
    const { error } = await resend.emails.send({
      from: env.emailFrom,
      to: inquiry.email,
      replyTo: to,
      subject: `We received your ${inquiry.type === "trip" ? "trip request" : "message"} — ${company}`,
      html: wrap("Thank you — we'll be in touch", visitorBody, company),
    });
    result.visitor = !error;
    if (error) console.error("[email] visitor confirmation failed", error);
  } catch (e) {
    console.error("[email] visitor confirmation failed", e);
  }
  return result;
}
