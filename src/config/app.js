export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Audiovenue',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL,
  adminName: process.env.ADMIN_NAME || 'Admin',
  email: {
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    fromName: process.env.FROM_NAME || 'Audiovenue',
  },
}

export const PAYMENT_METHODS = [
  {
    id: 'CASH_ON_DELIVERY',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: '💵',
  },
  {
    id: 'MOBILE_MONEY',
    label: 'Mobile Money',
    description: 'Pay via MTN or Orange Money',
    icon: '📱',
  },
  {
    id: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    description: 'Transfer directly to our bank account',
    icon: '🏦',
  },
]

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_COLORS = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'purple',
  SHIPPED: 'orange',
  DELIVERED: 'green',
  CANCELLED: 'red',
}
