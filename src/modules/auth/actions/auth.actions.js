'use server'
import {
  createEmailVerificationCode,
  validateEmailVerificationCode,
  markUserEmailVerified,
} from '@/src/modules/auth/services/auth.service'
import { sendVerificationEmail } from '@/src/modules/notifications/services/notification.service'
import { verifyEmailSchema } from '@/src/modules/auth/validators/auth.validator'
import bcrypt from 'bcryptjs'
import { signIn, signOut } from '@/src/lib/auth'
import prisma from '@/src/lib/db'
import { registerSchema } from '@/src/modules/auth/validators/auth.validator'
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
        name, email, password: hashedPassword, phone,
        cart: { create: {} },
        wishlist: { create: {} },
      },
    })

    const code = await createEmailVerificationCode(email)
    await sendVerificationEmail({ to: email, name, code })

    return { success: true, email }
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
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { emailVerified: true },
    })
    if (user && !user.emailVerified) {
      return { success: false, error: 'Please verify your email first', needsVerification: true, email: data.email }
    }

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

export async function verifyEmailAction(data) {
  try {
    const parsed = verifyEmailSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }
    const { email, code } = parsed.data

    const result = await validateEmailVerificationCode(email, code)
    if (!result.ok) {
      return {
        success: false,
        error: result.reason === 'expired'
          ? 'This code has expired. Request a new one.'
          : 'Invalid verification code',
      }
    }

    await markUserEmailVerified(email)
    return { success: true }
  } catch (error) {
    console.error('Verify email error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function resendCodeAction(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true, emailVerified: true },
    })
    if (!user) return { success: false, error: 'No account found for this email' }
    if (user.emailVerified) return { success: false, error: 'This email is already verified' }

    const code = await createEmailVerificationCode(email)
    await sendVerificationEmail({ to: email, name: user.name, code })
    return { success: true }
  } catch (error) {
    console.error('Resend code error:', error)
    return { success: false, error: 'Could not resend the code' }
  }
}