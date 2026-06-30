export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Audiovenue',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL,
  adminName: process.env.ADMIN_NAME || 'Admin',
  email: {
    from: process.env.FROM_EMAIL || 'noreply@audioavenue.store',
    fromName: process.env.FROM_NAME || 'Audiovenue',
  },
    contact: {
    email: 'w5@audiovenue.com',
    phone: '01628 633995',
    hours: '10:00 – 18:00',
  },
  social: {
    facebook: 'https://facebook.com/audiovenue',
    instagram: 'https://instagram.com/audiovenue',
    twitter: 'https://twitter.com/audiovenue',
  },
  email: {
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    fromName: process.env.FROM_NAME || 'Audio Venue',
  },
}


export const PAYMENT_METHODS = [
  {
    id: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    description: 'Transfer directly to our bank account',
    icon: '🏦',
    requiresReference: true,
    payTo: 'TODO: Bank name • Account name • Account number • Routing',
    referenceLabel: 'Name on your bank account',
    referencePlaceholder: 'e.g. John Doe',
  },
  {
    id: 'CHIME',
    label: 'Chime',
    description: 'Send via your Chime account',
    icon: '💚',
    requiresReference: true,
    payTo: 'TODO: $YourChimeSign',
    referenceLabel: 'Your Chime $ChimeSign or name',
    referencePlaceholder: '$yoursign',
  },
  {
    id: 'CASHAPP',
    label: 'Cash App',
    description: 'Pay with your $Cashtag',
    icon: '💵',
    requiresReference: true,
    payTo: 'TODO: $YourCashtag',
    referenceLabel: 'Your $Cashtag',
    referencePlaceholder: '$yourcashtag',
  },
  {
    id: 'ZELLE',
    label: 'Zelle',
    description: 'Bank-to-bank via Zelle',
    icon: '⚡',
    requiresReference: true,
    payTo: 'TODO: your-zelle@email.com',
    referenceLabel: 'Email or phone used for Zelle',
    referencePlaceholder: 'you@email.com',
  },
  {
    id: 'APPLE_PAY',
    label: 'Apple Pay',
    description: 'Pay with Apple Pay',
    icon: '',
    requiresReference: true,
    payTo: 'TODO: phone/email for Apple Pay',
    referenceLabel: 'Phone or email used for Apple Pay',
    referencePlaceholder: '+1 555 000 0000',
  },
  {
    id: 'PAYPAL',
    label: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🅿️',
    requiresReference: true,
    payTo: 'TODO: your-paypal@email.com',
    referenceLabel: 'Your PayPal email',
    referencePlaceholder: 'you@email.com',
  },
  {
    id: 'VENMO',
    label: 'Venmo',
    description: 'Send via Venmo',
    icon: '🔵',
    requiresReference: true,
    payTo: 'TODO: @YourVenmo',
    referenceLabel: 'Your @Venmo username',
    referencePlaceholder: '@yourusername',
  },
  {
    id: 'CARD',
    label: 'Credit/Debit Card',
    description: 'We’ll send a secure payment link',
    icon: '💳',
    requiresReference: false,
  },
  {
    id: 'BITCOIN',
    label: 'Bitcoin',
    description: 'Pay with BTC',
    icon: '₿',
    requiresReference: true,
    payTo: 'TODO: your BTC wallet address',
    referenceLabel: 'Transaction ID / sending wallet',
    referencePlaceholder: 'tx hash or wallet address',
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

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/shop' },
  { label: 'Brands', href: '/brands' },
  { label: 'Installs', href: '/installs' },
  { label: 'Systems', href: '/systems' },
  { label: 'Trade-Ins', href: '/trade-ins' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Showrooms', href: '/showrooms' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Special Offers', href: '/special-offers' },
]

// Single source of truth for labels everywhere (emails, order pages, admin)
export const PAYMENT_METHOD_LABELS = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.id, m.label])
)