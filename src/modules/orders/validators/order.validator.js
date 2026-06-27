import { z } from 'zod'
import { PAYMENT_METHODS } from '@/src/config/app'


const paymentIds = PAYMENT_METHODS.map((m) => m.id)
export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State / Region is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
  type: z.enum(['SHIPPING', 'BILLING']).default('SHIPPING'),
  isDefault: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  address: addressSchema,
  paymentMethod: z.enum(paymentIds),
  paymentDetails: z.string().optional(),
  notes: z.string().optional(),
})