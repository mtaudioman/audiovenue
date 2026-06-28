import { sendEmail } from '@/src/lib/email'
import {
  customerOrderConfirmationTemplate,
  adminNewOrderTemplate,verificationCodeTemplate,
} from './email.templates'
import { APP_CONFIG } from '@/src/config/app'

export async function sendOrderConfirmationEmails(order) {
  const results = await Promise.allSettled([
    // Email to customer
    sendEmail({
      to: order.user.email,
      subject: `Order Confirmed #${order.orderNumber} — ${APP_CONFIG.name}`,
      html: customerOrderConfirmationTemplate(order),
    }),

    // Email to admin
    sendEmail({
      to: APP_CONFIG.adminEmail,
      subject: `🛒 New Order #${order.orderNumber} from ${order.user.name}`,
      html: adminNewOrderTemplate(order),
    }),
  ])

  const customerResult = results[0]
  const adminResult = results[1]

  return {
    customerEmailSent: customerResult.status === 'fulfilled' && customerResult.value.success,
    adminEmailSent: adminResult.status === 'fulfilled' && adminResult.value.success,
  }
}

export async function sendVerificationEmail({ to, name, code }) {
  return sendEmail({
    to,
    subject: `Your ${APP_CONFIG.name} verification code: ${code}`,
    html: verificationCodeTemplate({ name, code }),
  })
}

