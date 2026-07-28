'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Link2, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | undefined) => void
  label?: string
  className?: string
}

/**
 * Upload an image (stored in MongoDB via /api/upload) or paste an external URL.
 */
export default function ImageUpload({ value, onChange, label = 'Picture', className }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')

  const handleFile = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        toast.error(payload.error ?? 'Upload failed')
        return
      }
      onChange(payload.data.url)
      toast.success('Image uploaded! 🖼️')
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-xs font-bold text-muted-foreground">{label} (optional)</label>

      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Question" className="max-h-36 rounded-2xl border border-border object-contain" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={isUploading}
            onClick={() => fileRef.current?.click()}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            Upload image
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowUrlInput((v) => !v)}
          >
            <Link2 className="w-4 h-4" /> Use URL
          </Button>
          {showUrlInput && (
            <div className="flex items-center gap-2 w-full">
              <Input
                placeholder="https://example.com/picture.png"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                className="h-9 text-sm"
              />
              <Button
                type="button"
                size="sm"
                disabled={!urlDraft.trim()}
                onClick={() => {
                  onChange(urlDraft.trim())
                  setUrlDraft('')
                  setShowUrlInput(false)
                }}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
