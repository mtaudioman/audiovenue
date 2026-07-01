'use client'

import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { Upload, X } from 'lucide-react'

export default function ImageUpload({ value, onChange, folder = 'audiovollum/uploads' }) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  function handleSuccess(result) {
    const secureUrl = result?.info?.secure_url
    if (!secureUrl) return
    onChange(secureUrl)
  }
 
  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Uploaded"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-lg border border-zinc-200"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        uploadPreset ? (
          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            uploadPreset={uploadPreset}
            onSuccess={handleSuccess}
            options={{
              maxFiles: 1,
              resourceType: 'image',
              folder,
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-zinc-300 rounded-lg text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-colors"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-xs">Upload</span>
              </button>
            )}
          </CldUploadWidget>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 text-xs flex items-center justify-center p-2 text-center">
            Missing Cloudinary upload preset
          </div>
        )
      )}
    </div>
  )
}