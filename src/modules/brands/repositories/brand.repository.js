import prisma from '@/src/lib/db'

export async function findAllBrands({ includeInactive = false } = {}) {
  return prisma.brand.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true, categories: true } },
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      },
    },
  })
}

export async function findBrandBySlug(slug) {
  return prisma.brand.findUnique({
    where: { slug },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          products: {
            where: { status: 'ACTIVE' },
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              reviews: { select: { rating: true } },
            },
          },
        },
      },
    },
  })
}

export async function findBrandById(id) {
  return prisma.brand.findUnique({
    where: { id },
    include: {
      categories: {
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { products: true } } },
      },
      _count: { select: { products: true } },
    },
  })
}

export async function createBrand(data) {
  return prisma.brand.create({ data })
}

export async function updateBrand(id, data) {
  return prisma.brand.update({ where: { id }, data })
}

export async function deleteBrand(id) {
  return prisma.brand.delete({ where: { id } })
}
