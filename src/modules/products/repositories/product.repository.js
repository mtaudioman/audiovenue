import prisma from '@/src/lib/db'

export async function findAllProducts({
  page = 1,
  limit = 12,
  category,
  search,
  sort = 'createdAt',
  order = 'desc',
  featured,
  status = 'ACTIVE',
} = {}) {
  const skip = (page - 1) * limit

  const where = {
    status,
    ...(category && { category: { slug: category } }),
    ...(featured !== undefined && { isFeatured: featured }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort]: order },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
    page,
  }
}

export async function findProductBySlug(slug) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { createdAt: 'asc' } },
      tags: { include: { tag: true } },
      reviews: {
        where: { isApproved: true },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function findProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      tags: { include: { tag: true } },
    },
  })
}

export async function findFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isFeatured: true, status: 'ACTIVE' },
    take: limit,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { select: { rating: true } },
      category: { select: { name: true, slug: true } },
    },
  })
}

export async function findRelatedProducts(categoryId, excludeId, limit = 4) {
  return prisma.product.findMany({
    where: {
      categoryId,
      status: 'ACTIVE',
      id: { not: excludeId },
    },
    take: limit,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
  })
}

export async function createProduct(data) {
  return prisma.product.create({ data })
}

export async function updateProduct(id, data) {
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id) {
  return prisma.product.delete({ where: { id } })
}