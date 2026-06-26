'use server'

import bcrypt from 'bcryptjs'
import { signIn, signOut } from '@/lib/auth'
import prisma from '@/lib/db'
import { registerSchema } from '@/modules/auth/validators/auth.validator'
import { AuthError } from 'next-auth'

export async function registerAction(data) {
  try {
    const parsed = registerSchema.safeParse(data)

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0].message,
      }
    }

    const { name, email, password, phone } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists',
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        cart: { create: {} },
        wishlist: { create: {} },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Register error:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}

export async function loginAction(data) {
  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: 'Invalid email or password',
          }
        default:
          return {
            success: false,
            error: 'Something went wrong. Please try again.',
          }
      }
    }
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' })
}