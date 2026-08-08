export function generateInvoiceNumber(orderNumber) {
  return `INV-${orderNumber}`;
}

// Customer-supplied fields (name, address, item titles, etc.) flow into this HTML,
// which is emailed and could be re-rendered elsewhere — escape before interpolating.
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildInvoiceHtml(order) {
  const itemsHtml = (order.items || []).map(it => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(it.title)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(it.size) || '—'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${escapeHtml(it.quantity)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${it.price?.toLocaleString('en-IN')}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${(it.price * it.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const addr = order.shippingAddress || {};

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Footers Invoice</title></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:700px;margin:0 auto;padding:20px;">
  <div style="background:#1a1a1a;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
    <h1 style="margin:0;color:#f59e0b;">FOOTERS</h1>
    <p style="margin:4px 0 0;opacity:0.8;">Premium Footwear — Kolhapur</p>
  </div>
  <div style="border:1px solid #eee;border-top:none;padding:24px;">
    <h2 style="margin-top:0;">Invoice ${order.invoiceNumber || order.orderNumber}</h2>
    <p><strong>Order:</strong> ${order.orderNumber}</p>
    <p><strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
    <h3>Customer Details</h3>
    <p>${escapeHtml(order.customerName)}<br>${escapeHtml(order.customerPhone)}<br>${escapeHtml(order.customerEmail)}</p>
    <p>${escapeHtml(addr.line1)}<br>${escapeHtml(addr.city)}, ${escapeHtml(addr.state)} — ${escapeHtml(addr.pincode)}</p>
    <h3>Products</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:8px;text-align:left;">Product</th>
        <th style="padding:8px;text-align:left;">Size</th>
        <th style="padding:8px;">Qty</th>
        <th style="padding:8px;text-align:right;">Price</th>
        <th style="padding:8px;text-align:right;">Total</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="margin-top:20px;text-align:right;">
      <p>Subtotal: ₹${order.subtotal?.toLocaleString('en-IN')}</p>
      ${order.discount > 0 ? `<p>Discount: -₹${order.discount?.toLocaleString('en-IN')}</p>` : ''}
      ${order.shippingCost > 0 ? `<p>Shipping: ₹${order.shippingCost?.toLocaleString('en-IN')}</p>` : '<p>Shipping: FREE</p>'}
      ${order.tax > 0 ? `<p>GST: ₹${order.tax?.toLocaleString('en-IN')}</p>` : ''}
      <p style="font-size:18px;font-weight:bold;">Total: ₹${order.total?.toLocaleString('en-IN')}</p>
      <p><strong>Payment:</strong> ${(order.paymentMethod || 'cod').toUpperCase()}</p>
    </div>
    ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.trackingNumber} (${order.courierPartner || 'Courier'})</p>` : ''}
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
    <p style="text-align:center;color:#666;">Thank you for shopping with Footers! We appreciate your trust in our handcrafted footwear.</p>
  </div>
</body></html>`;
}

export default { generateInvoiceNumber, buildInvoiceHtml };
