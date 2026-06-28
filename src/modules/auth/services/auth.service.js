import prisma from '@/src/lib/db'

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })
}

export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isActive: true,
    },
  })
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)) // 6 digits
}

export async function createEmailVerificationCode(email) {
  // one active code per email
  await prisma.verificationToken.deleteMany({ where: { identifier: email } })
  const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  // token is globally unique — retry on the rare collision
  for (let i = 0; i < 5; i++) {
    const code = generateCode()
    try {
      await prisma.verificationToken.create({
        data: { identifier: email, token: code, expires },
      })
      return code
    } catch (e) {
      if (e.code === 'P2002') continue
      throw e
    }
  }
  throw new Error('Could not generate a verification code')
}

export async function validateEmailVerificationCode(email, code) {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: code } },
  })
  if (!record) return { ok: false, reason: 'invalid' }
  if (record.expires < new Date()) return { ok: false, reason: 'expired' }
  return { ok: true }
}

export async function markUserEmailVerified(email) {
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
  ])
}