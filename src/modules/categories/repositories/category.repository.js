import prisma from '@/src/lib/db'

export async function findAllCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { products: true, children: true } },
    },
  })
}

export async function findCategoryById(id) {
  return prisma.category.findUnique({ where: { id } })
}

export async function findCategoryBySlug(slug) {
  return prisma.category.findUnique({ where: { slug } })
}

export async function createCategory(data) {
  return prisma.category.create({ data })
}

export async function updateCategory(id, data) {
  return prisma.category.update({ where: { id }, data })
}

export async function deleteCategory(id) {
  return prisma.category.delete({ where: { id } })
}