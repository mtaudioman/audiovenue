import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { configureCloudinary, getCloudinaryConfig } from '@/src/lib/cloudinary.server'

export const runtime = 'nodejs'

const SIGN_MAX_AGE_SECONDS = 10 * 60
const SIGN_WINDOW_MS = 60 * 1000
const SIGN_MAX_REQUESTS_PER_WINDOW = 30
const ALLOWED_FOLDER_PREFIXES = [
  'audiovollum/products',
  'audiovollum/categories',
  'audiovollum/brands',
]

const userSignRequestHistory = new Map()

const ALLOWED_SIGNED_KEYS = new Set([
  'timestamp',
  'folder',
  'public_id',
  'upload_preset',
  'source',
  'tags',
  'context',
  'eager',
  'transformation',
  'invalidate',
])

function sanitizeParams(paramsToSign) {
  if (!paramsToSign || typeof paramsToSign !== 'object') return null

  const sanitized = {}
  for (const [key, value] of Object.entries(paramsToSign)) {
    if (!ALLOWED_SIGNED_KEYS.has(key)) continue
    if (value === undefined || value === null || value === '') continue
    sanitized[key] = value
  }

  if (!sanitized.timestamp) return null
  return sanitized
}

function checkRateLimit(userId) {
  const now = Date.now()
  const recent = (userSignRequestHistory.get(userId) || []).filter(
    (time) => now - time < SIGN_WINDOW_MS
  )

  if (recent.length >= SIGN_MAX_REQUESTS_PER_WINDOW) {
    userSignRequestHistory.set(userId, recent)
    return false
  }

  recent.push(now)
  userSignRequestHistory.set(userId, recent)
  return true
}

function isAllowedFolder(folder) {
  if (typeof folder !== 'string' || !folder.trim()) return false
  if (folder.includes('..')) return false
  return ALLOWED_FOLDER_PREFIXES.some(
    (prefix) => folder === prefix || folder.startsWith(`${prefix}/`)
  )
}

export async function POST(request) {
  // Only signed-in admins can get an upload signature
  const session = await auth()
  if (
    !session?.user ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkRateLimit(session.user.id)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const paramsToSign = sanitizeParams(body?.paramsToSign)
  if (!paramsToSign) {
    return NextResponse.json({ error: 'Invalid signature params' }, { status: 400 })
  }

  const timestampSeconds = Number(paramsToSign.timestamp)
  if (!Number.isFinite(timestampSeconds)) {
    return NextResponse.json({ error: 'Invalid timestamp' }, { status: 400 })
  }

  const nowSeconds = Math.floor(Date.now() / 1000)
  if (Math.abs(nowSeconds - timestampSeconds) > SIGN_MAX_AGE_SECONDS) {
    return NextResponse.json({ error: 'Signature timestamp expired' }, { status: 400 })
  }

  if (!isAllowedFolder(paramsToSign.folder)) {
    return NextResponse.json({ error: 'Invalid upload folder' }, { status: 400 })
  }

  let cfg
  try {
    cfg = getCloudinaryConfig()
  } catch (error) {
    console.error('Cloudinary configuration error:', error)
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })
  }

  if (
    paramsToSign.upload_preset &&
    paramsToSign.upload_preset !== cfg.uploadPreset
  ) {
    return NextResponse.json({ error: 'Invalid upload preset' }, { status: 400 })
  }

  const cloudinary = configureCloudinary()

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cfg.apiSecret
  )

  return NextResponse.json({ signature })
}