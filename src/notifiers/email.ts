import { Resend } from 'resend';

export async function sendEmail(params: {
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = (process.env.EMAIL_TO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!key || !from || to.length === 0) {
    console.warn('[email] skipping send — RESEND_API_KEY / EMAIL_FROM / EMAIL_TO not set');
    return;
  }

  const resend = new Resend(key);
  const result = await resend.emails.send({
    from,
    to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? JSON.stringify(result.error)}`);
  }
}
