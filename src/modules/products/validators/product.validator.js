import { z } from 'zod'

const productImageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  alt: z.string().optional().nullable(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
})

const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  value: z.string().min(1, 'Variant value is required'),
  price: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  sku: z.string().optional().nullable(),
})

const nestedImagesSchema = z.object({
  create: z.array(productImageSchema).optional(),
  deleteMany: z.record(z.string(), z.any()).optional(),
})

const nestedVariantsSchema = z.object({
  create: z.array(productVariantSchema).optional(),
  deleteMany: z.record(z.string(), z.any()).optional(),
})

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
  images: nestedImagesSchema.optional(),
  variants: nestedVariantsSchema.optional(),
})
