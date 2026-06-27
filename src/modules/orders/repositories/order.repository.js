import prisma from '@/src/lib/db'

export async function createOrder(data) {
  return prisma.order.create({
    data,
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      user: true,
      address: true,
    },
  })
}

export async function findOrderByNumber(orderNumber) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
      user: true,
      address: true,
    },
  })
}

export async function findOrderById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
      user: true,
      address: true,
    },
  })
}

export async function findOrdersByUserId(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function findAllOrders({ page = 1, limit = 20, status } = {}) {
  const skip = (page - 1) * limit
  const where = status ? { status } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ])

  return { orders, total, pages: Math.ceil(total / limit) }
}

export async function updateOrderStatus(id, status) {
  return prisma.order.update({
    where: { id },
    data: { status },
  })
}

export async function updateOrderEmailStatus(id, data) {
  return prisma.order.update({
    where: { id },
    data,
  })
}

export async function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 9000) + 1000
  return `AV-${year}${month}${day}-${random}`
}