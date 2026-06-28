import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  lowStockAt: z.number().int().min(0).default(5),
  weight: z.number().positive().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
})
