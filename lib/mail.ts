import "server-only";

/**
 * Optional form-notification e-mail.
 *
 * Sending is entirely opt-in: when SMTP_HOST is not configured the functions
 * become no-ops so the site works out of the box without an e-mail provider.
 * Nodemailer is imported lazily so it is only loaded when a notification is
 * actually sent, and a send failure never fails the form submission.
 */

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.FORM_NOTIFICATION_EMAIL);
}

export type NotificationInput = {
  subject: string;
  lines: Array<[label: string, value: string]>;
};

export async function sendFormNotification(input: NotificationInput): Promise<void> {
  if (!isMailConfigured()) return;

  try {
    const nodemailer = await import("nodemailer");

    const transport = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    const html = `
      <div style="font-family:Arial,sans-serif;color:#1E262B">
        <h2 style="color:#063E36;margin-bottom:16px">${escapeHtml(input.subject)}</h2>
        <table style="border-collapse:collapse">
          ${input.lines
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:6px 16px 6px 0;color:#6A7479;vertical-align:top">${escapeHtml(label)}</td>
              <td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td>
            </tr>`,
            )
            .join("")}
        </table>
        <p style="margin-top:24px;color:#6A7479;font-size:12px">
          Bu e-posta Kazanım Gayrimenkul web sitesi formundan otomatik olarak gönderilmiştir.
        </p>
      </div>`;

    await transport.sendMail({
      from: process.env.SMTP_USER ?? process.env.FORM_NOTIFICATION_EMAIL,
      to: process.env.FORM_NOTIFICATION_EMAIL,
      subject: input.subject,
      html,
    });
  } catch (error) {
    // A failed notification must never fail the lead capture.
    console.error("[mail] notification failed:", error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
