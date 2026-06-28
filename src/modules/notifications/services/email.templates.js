import { APP_CONFIG } from '@/src/config/app'
import { ORDER_STATUS_LABELS } from '@/src/config/app'

import { PAYMENT_METHOD_LABELS } from '@/src/config/app'

function baseLayout(content) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${APP_CONFIG.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; color: #18181b; }
          .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          .header { background: #18181b; padding: 32px; text-align: center; }
          .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { color: #a1a1aa; font-size: 14px; margin-top: 4px; }
          .body { padding: 32px; }
          .section { margin-bottom: 28px; }
          .section-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #71717a; margin-bottom: 12px; }
          .card { background: #f4f4f5; border-radius: 8px; padding: 20px; }
          .row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e4e4e7; }
          .row:last-child { border-bottom: none; }
          .row-label { font-size: 14px; color: #52525b; }
          .row-value { font-size: 14px; font-weight: 500; color: #18181b; }
          .product-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e4e4e7; }
          .product-item:last-child { border-bottom: none; }
          .product-name { font-size: 14px; font-weight: 500; }
          .product-qty { font-size: 13px; color: #71717a; }
          .product-price { font-size: 14px; font-weight: 600; }
          .total-row { display: flex; justify-content: space-between; padding: 16px 0 0; margin-top: 8px; }
          .total-label { font-size: 16px; font-weight: 700; }
          .total-value { font-size: 18px; font-weight: 700; color: #18181b; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; background: #fef9c3; color: #854d0e; }
          .payment-badge { background: #dcfce7; color: #166534; }
          .footer { background: #f4f4f5; padding: 24px 32px; text-align: center; }
          .footer p { font-size: 13px; color: #71717a; line-height: 1.6; }
          .divider { height: 1px; background: #e4e4e7; margin: 24px 0; }
          .highlight { color: #2563eb; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          ${content}
        </div>
      </body>
    </html>
  `
}


// CUSTOMER ORDER CONFIRMATION EMAIL

export function customerOrderConfirmationTemplate(order) {
  const {
    orderNumber,
    user,
    address,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    paymentMethod,
    paymentDetails,
    notes,
  } = order


  const itemsHtml = items
    .map(
      (item) => `
      <div class="product-item">
        <div>
          <div class="product-name">${item.name}</div>
          <div class="product-qty">Qty: ${item.quantity}${item.variant ? ` · ${item.variant.name}: ${item.variant.value}` : ''}</div>
        </div>
        <div class="product-price">$${item.total.toFixed(2)}</div>
      </div>
    `
    )
    .join('')

  const content = `
    <div class="header">
      <h1>${APP_CONFIG.name}</h1>
      <p>Order Confirmation</p>
    </div>

    <div class="body">
      <div class="section">
        <p style="font-size: 16px; margin-bottom: 8px;">Hi <strong>${user.name}</strong>,</p>
        <p style="font-size: 14px; color: #52525b; line-height: 1.6;">
          Thank you for your order! We have received it and will contact you shortly to confirm everything.
          Your order number is <span class="highlight">#${orderNumber}</span>.
        </p>
      </div>

      <div class="section">
        <div class="section-title">Order Summary</div>
        <div class="card">
          ${itemsHtml}
          <div class="divider"></div>
          <div class="row">
            <span class="row-label">Subtotal</span>
            <span class="row-value">$${Number(subtotal).toFixed(2)}</span>
          </div>
          <div class="row">
            <span class="row-label">Shipping</span>
            <span class="row-value">${Number(shippingCost) === 0 ? 'Free' : '$' + Number(shippingCost).toFixed(2)}</span>
          </div>
          ${Number(discount) > 0 ? `
          <div class="row">
            <span class="row-label">Discount</span>
            <span class="row-value" style="color: #16a34a;">-$${Number(discount).toFixed(2)}</span>
          </div>` : ''}
          <div class="total-row">
            <span class="total-label">Total</span>
            <span class="total-value">$${Number(total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Payment Method</div>
        <div class="card">
          <div class="row">
            <span class="row-label">Method</span>
            <span class="badge payment-badge">${PAYMENT_METHOD_LABELS[paymentMethod]}</span>
          </div>
          ${paymentDetails ? `
          <div style="margin-top: 12px; font-size: 14px; color: #52525b; line-height: 1.6;">
            <strong>Payment Instructions:</strong><br/>
            ${paymentDetails}
          </div>` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Delivery Address</div>
        <div class="card">
          <p style="font-size: 14px; line-height: 1.8; color: #52525b;">
            ${address.firstName} ${address.lastName}<br/>
            ${address.street}<br/>
            ${address.city}, ${address.state} ${address.postalCode}<br/>
            ${address.country}<br/>
            ${address.phone ? `📞 ${address.phone}` : ''}
          </p>
        </div>
      </div>

      ${notes ? `
      <div class="section">
        <div class="section-title">Your Notes</div>
        <div class="card">
          <p style="font-size: 14px; color: #52525b;">${notes}</p>
        </div>
      </div>` : ''}

      <div class="section">
        <p style="font-size: 13px; color: #71717a; line-height: 1.6; text-align: center;">
          Questions? Reply to this email or contact us at 
          <a href="mailto:${APP_CONFIG.adminEmail}" style="color: #2563eb;">${APP_CONFIG.adminEmail}</a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p>${APP_CONFIG.name} · All rights reserved</p>
      <p style="margin-top: 4px;">${APP_CONFIG.url}</p>
    </div>
  `

  return baseLayout(content)
}


export function verificationCodeTemplate({ name, code }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fafafa;border-radius:16px">
    <h1 style="font-size:22px;color:#18181b;margin:0 0 4px">Audio Venue</h1>
    <p style="color:#71717a;margin:0 0 24px">Verify your email address</p>
    <p style="color:#3f3f46">Hi ${name || 'there'}, use this code to finish creating your account:</p>
    <div style="text-align:center;margin:24px 0">
      <span style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:700;color:#8B8B5A;background:#fff;border:1px solid #e4e4e7;border-radius:12px;padding:16px 24px">${code}</span>
    </div>
    <p style="color:#a1a1aa;font-size:13px">This code expires in 15 minutes. If you didn't request it, you can ignore this email.</p>
  </div>`
}

// ADMIN NEW ORDER NOTIFICATION EMAIL

export function adminNewOrderTemplate(order) {
  const {
    orderNumber,
    user,
    address,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    paymentMethod,
    notes,
    createdAt,
  } = order



  const itemsHtml = items
    .map(
      (item) => `
      <div class="product-item">
        <div>
          <div class="product-name">${item.name}</div>
          <div class="product-qty">SKU: ${item.product?.sku || 'N/A'} · Qty: ${item.quantity}</div>
        </div>
        <div class="product-price">$${Number(item.total).toFixed(2)}</div>
      </div>
    `
    )
    .join('')

  const content = `
    <div class="header">
      <h1>🛒 New Order Received</h1>
      <p>${APP_CONFIG.name} Admin Notification</p>
    </div>

    <div class="body">
      <div class="section">
        <p style="font-size: 15px;">
          A new order <span class="highlight">#${orderNumber}</span> has been placed on 
          <strong>${new Date(createdAt).toLocaleString()}</strong>.
        </p>
      </div>

      <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="card">
          <div class="row">
            <span class="row-label">Name</span>
            <span class="row-value">${user.name}</span>
          </div>
          <div class="row">
            <span class="row-label">Email</span>
            <span class="row-value">${user.email}</span>
          </div>
          <div class="row">
            <span class="row-label">Phone</span>
            <span class="row-value">${user.phone || address.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Delivery Address</div>
        <div class="card">
          <p style="font-size: 14px; line-height: 1.8; color: #52525b;">
            ${address.firstName} ${address.lastName}<br/>
            ${address.company ? address.company + '<br/>' : ''}
            ${address.street}<br/>
            ${address.city}, ${address.state} ${address.postalCode}<br/>
            ${address.country}<br/>
            ${address.phone ? `📞 ${address.phone}` : ''}
          </p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Payment Method</div>
        <div class="card">
          <div class="row">
            <span class="row-label">Method</span>
            <span class="badge payment-badge">${PAYMENT_METHOD_LABELS[paymentMethod]}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Items Ordered</div>
        <div class="card">
          ${itemsHtml}
          <div class="divider"></div>
          <div class="row">
            <span class="row-label">Subtotal</span>
            <span class="row-value">$${Number(subtotal).toFixed(2)}</span>
          </div>
          <div class="row">
            <span class="row-label">Shipping</span>
            <span class="row-value">${Number(shippingCost) === 0 ? 'Free' : '$' + Number(shippingCost).toFixed(2)}</span>
          </div>
          ${Number(discount) > 0 ? `
          <div class="row">
            <span class="row-label">Discount</span>
            <span class="row-value" style="color: #16a34a;">-$${Number(discount).toFixed(2)}</span>
          </div>` : ''}
          <div class="total-row">
            <span class="total-label">Order Total</span>
            <span class="total-value">$${Number(total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      ${notes ? `
      <div class="section">
        <div class="section-title">Customer Notes</div>
        <div class="card">
          <p style="font-size: 14px; color: #52525b;">${notes}</p>
        </div>
      </div>` : ''}

      <div class="section">
        <a href="${APP_CONFIG.url}/admin/orders/${orderNumber}" 
           style="display: block; text-align: center; background: #18181b; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          View Order in Admin Panel
        </a>
      </div>
    </div>

    <div class="footer">
      <p>${APP_CONFIG.name} Admin · This is an automated notification</p>
    </div>
  `

  return baseLayout(content)
}