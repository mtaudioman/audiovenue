import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

const CLOUDINARY_HOSTNAME = 'res.cloudinary.com'

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required Cloudinary env: ${name}`)
  }
  return value
}

export function getCloudinaryConfig() {
  return {
    cloudName: requiredEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
    apiKey: requiredEnv('NEXT_PUBLIC_CLOUDINARY_API_KEY'),
    apiSecret: requiredEnv('CLOUDINARY_API_SECRET'),
    uploadPreset: requiredEnv('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'),
  }
}

let configured = false

export function configureCloudinary() {
  if (configured) return cloudinary
  const cfg = getCloudinaryConfig()

  cloudinary.config({
    cloud_name: cfg.cloudName,
    api_key: cfg.apiKey,
    api_secret: cfg.apiSecret,
    secure: true,
  })

  configured = true
  return cloudinary
}

export function extractCloudinaryPublicIdFromUrl(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname !== CLOUDINARY_HOSTNAME) return null

    const segments = parsed.pathname.split('/').filter(Boolean)
    const uploadIndex = segments.findIndex((segment) => segment === 'upload')
    if (uploadIndex === -1) return null

    const publicIdSegments = segments.slice(uploadIndex + 1)
    if (publicIdSegments.length === 0) return null

    if (/^v\d+$/.test(publicIdSegments[0])) {
      publicIdSegments.shift()
    }

    const withExt = decodeURIComponent(publicIdSegments.join('/'))
    return withExt.replace(/\.[^/.]+$/, '') || null
  } catch {
    return null
  }
}

export async function destroyCloudinaryAssetByUrl(url, options = {}) {
  const publicId = extractCloudinaryPublicIdFromUrl(url)
  if (!publicId) {
    return { skipped: true, reason: 'not-cloudinary-url' }
  }

  const api = configureCloudinary()

  try {
    const result = await api.uploader.destroy(publicId, {
      resource_type: options.resourceType || 'image',
      invalidate: options.invalidate ?? true,
    })
    return { skipped: false, publicId, result }
  } catch (error) {
    console.error('Cloudinary destroy failed:', error)
    return { skipped: false, publicId, error: true }
  }
}