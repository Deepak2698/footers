import nodemailer from 'nodemailer';
import { buildInvoiceHtml } from '../invoice/invoiceService.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: SMTP_PORT === '465',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return transporter;
}

export async function sendOrderInvoiceEmail(order) {
  if (!order.customerEmail) {
    return { sent: false, reason: 'No customer email provided' };
  }

  const transport = getTransporter();
  if (!transport) {
    console.warn('[Email] SMTP not configured — invoice email skipped for order', order.orderNumber);
    return { sent: false, reason: 'SMTP not configured' };
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const html = buildInvoiceHtml(order);

  try {
    await transport.sendMail({
      from: `"Footers" <${from}>`,
      to: order.customerEmail,
      subject: `Footers Invoice — ${order.invoiceNumber || order.orderNumber}`,
      html
    });
    return { sent: true };
  } catch (err) {
    console.error('[Email] Failed to send invoice:', err.message);
    return { sent: false, reason: err.message };
  }
}

export default { sendOrderInvoiceEmail };
