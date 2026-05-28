import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag, ImageIcon, Check, Loader2, AlertTriangle, Upload, Trash2 } from 'lucide-react'
import { useUrlPreview, normalizeUrl } from '@/hooks/useUrlPreview'
import { useProjects } from '@/context/ProjectsContext'
import { type Project } from '@/data/projects'
import { compressImage, formatBytes, base64SizeKb } from '@/lib/imageUtils'

const tools = [
  'Lovable', 'Cursor', 'Bolt', 'v0', 'Windsurf',
  'Claude', 'Replit', 'Vercel', 'Netlify', 'Webflow',
  'Framer', 'Figma', 'GitHub', 'WordPress', 'Custom',
]

const categoryOptions = [
  'Websites', 'SaaS', 'AI Tools', 'Mobile', 'Dev Tools',
  'Design', 'Productivity', 'Finance', 'Healthcare',
]

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefilledUrl?: string
}

function detectTool(rawUrl: string): string {
  try {
    const host = new URL(normalizeUrl(rawUrl)).hostname.toLowerCase()
    if (host.includes('lovable.app') || host.includes('lovableproject.com')) return 'Lovable'
    if (host.includes('cursor')) return 'Cursor'
    if (host.includes('bolt.new') || host.includes('stackblitz.io')) return 'Bolt'
    if (host.includes('v0.dev')) return 'v0'
    if (host.includes('replit.app') || host.includes('repl.co')) return 'Replit'
    if (host.includes('vercel.app') || host === 'vercel.com') return 'Vercel'
    if (host.includes('netlify.app') || host.includes('.netlify.com')) return 'Netlify'
    if (host.includes('webflow.io') || host.includes('webflow.com')) return 'Webflow'
    if (host.includes('framer.app') || host.includes('framer.site') || host.includes('framer.com')) return 'Framer'
    if (host.includes('figma.com')) return 'Figma'
    if (host.includes('github.io') || host.includes('github.com')) return 'GitHub'
    if (host.includes('emergent.sh') || host.includes('anthropic')) return 'Claude'
    if (host.includes('windsurf')) return 'Windsurf'
    if (host.includes('wix.com') || host.includes('wixsite.com')) return 'Custom'
    if (host.includes('wordpress.com') || host.includes('wordpress.org')) return 'WordPress'
  } catch { /* ignore */ }
  return ''
}

let nextId = Date.now()

export function UploadModal({ open, onOpenChange, prefilledUrl = '' }: UploadModalProps) {
  const { addProject } = useProjects()
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState(false)

  // Step 1 — raw URL as typed; we normalize on blur + before saving
  const [liveUrl, setLiveUrl] = useState(prefilledUrl)

  // Step 2
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tool, setTool] = useState('')
  const [codeUrl, setCodeUrl] = useState('')

  // Step 3 — tags
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  // Step 3 — thumbnail
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [thumbUploading, setThumbUploading] = useState(false)
  const [thumbError, setThumbError] = useState<string | null>(null)
  const [thumbOriginalSize, setThumbOriginalSize] = useState<number>(0)
  const [thumbCompressedKb, setThumbCompressedKb] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Always pass normalized URL to the preview hook
  const normalizedPreviewUrl = normalizeUrl(liveUrl)
  const preview = useUrlPreview(step >= 1 ? normalizedPreviewUrl : '')

  // Auto-fill metadata from URL preview
  useEffect(() => {
    if (!preview.loading && !preview.error) {
      if (preview.title && !name) setName(preview.title.slice(0, 60))
      if (preview.description && !description) setDescription(preview.description.slice(0, 200))
    }
  }, [preview.loading, preview.error, preview.title, preview.description, name, description])

  // Auto-detect tool from URL
  useEffect(() => {
    if (liveUrl && !tool) {
      const detected = detectTool(liveUrl)
      if (detected) setTool(detected)
    }
  }, [liveUrl, tool])

  // Sync prefilled URL when modal opens
  useEffect(() => {
    if (open && prefilledUrl) setLiveUrl(prefilledUrl)
  }, [open, prefilledUrl])

  const resetAll = () => {
    setStep(1); setPublished(false)
    setLiveUrl(''); setName(''); setDescription('')
    setCategory(''); setTool(''); setCodeUrl('')
    setTagInput(''); setTags([])
    setThumbnail(null); setThumbUploading(false)
    setThumbError(null); setThumbOriginalSize(0)
    setThumbCompressedKb(0); setIsDragging(false)
  }

  // Normalize the URL on blur so the field shows the clean version
  const handleUrlBlur = () => {
    const norm = normalizeUrl(liveUrl)
    if (norm && norm !== liveUrl) setLiveUrl(norm)
  }

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (t && !tags.includes(t) && tags.length < 6) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setThumbError('Please upload a JPG, PNG, or WEBP image.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setThumbError('File too large. Max 20 MB.')
      return
    }

    setThumbError(null)
    setThumbUploading(true)
    setThumbOriginalSize(file.size)

    try {
      const compressed = await compressImage(file)
      const kb = base64SizeKb(compressed)
      setThumbCompressedKb(kb)
      setThumbnail(compressed)
    } catch {
      setThumbError('Could not process image. Please try another file.')
    } finally {
      setThumbUploading(false)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const handlePublish = () => {
    // Always save with a properly normalized URL
    const savedUrl = normalizeUrl(liveUrl) || liveUrl
    // Thumbnail priority: manual upload > Microlink screenshot > OG image > none
    const finalThumbnail = thumbnail ?? preview.screenshotUrl ?? preview.ogImageUrl ?? undefined

    const project: Project = {
      id: ++nextId,
      title: name || 'Untitled Project',
      description: description || 'A project built with AI tools.',
      category: category || 'Websites',
      tags,
      tool: tool || 'Custom',
      creator: {
        name: 'You',
        username: 'you',
        initials: 'YO',
        color: '#6366f1',
        pro: false,
      },
      likes: 0,
      views: '0',
      saves: 0,
      liveUrl: savedUrl,
      codeUrl,
      gradient: '',
      accentColor: '#6366f1',
      cardSize: 'normal',
      screenshotUrl: finalThumbnail,
      isUserSubmitted: true,
    }

    addProject(project)
    setPublished(true)
    setTimeout(() => {
      onOpenChange(false)
      resetAll()
    }, 1800)
  }

  const inputClass = "w-full bg-white border border-neutral-200 rounded px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
  const labelClass = "block text-xs font-medium text-neutral-600 mb-1.5"

  const canProceedStep1 = liveUrl.trim().length > 0 && !preview.loading
  const canProceedStep2 = name.trim().length > 0

  if (!open) return null

  // Best available auto-preview to pass down
  const autoPreviewUrl = preview.screenshotUrl ?? preview.ogImageUrl

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        />

        <motion.div
          className="relative w-full sm:max-w-lg bg-white border border-neutral-200 rounded-t-2xl sm:rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Submit a Project</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Share anything — launched, WIP, prototype, or experiment</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center px-6 pt-4 gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all border ${step >= s ? 'bg-[#eb3403] text-white border-[#eb3403]' : 'bg-white text-neutral-400 border-neutral-200'}`}>
                  {step > s ? <Check className="w-2.5 h-2.5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-px mx-1.5 transition-all ${step > s ? 'bg-[#eb3403]' : 'bg-neutral-200'}`} />}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {published ? (
              <motion.div
                className="py-10 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">Project submitted!</h3>
                <p className="text-sm text-neutral-500">Your build is now live on Product Gallery.</p>
              </motion.div>

            ) : step === 1 ? (
              <StepOne
                liveUrl={liveUrl}
                setLiveUrl={setLiveUrl}
                onBlurNormalize={handleUrlBlur}
                preview={preview}
                inputClass={inputClass}
                labelClass={labelClass}
              />

            ) : step === 2 ? (
              <StepTwo
                name={name} setName={setName}
                description={description} setDescription={setDescription}
                category={category} setCategory={setCategory}
                tool={tool} setTool={setTool}
                codeUrl={codeUrl} setCodeUrl={setCodeUrl}
                inputClass={inputClass} labelClass={labelClass}
              />

            ) : (
              <StepThree
                tagInput={tagInput} setTagInput={setTagInput}
                tags={tags} setTags={setTags}
                addTag={addTag}
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
                thumbUploading={thumbUploading}
                thumbError={thumbError}
                thumbOriginalSize={thumbOriginalSize}
                thumbCompressedKb={thumbCompressedKb}
                isDragging={isDragging}
                fileInputRef={fileInputRef}
                handleFileInput={handleFileInput}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                autoPreviewUrl={autoPreviewUrl}
                inputClass={inputClass}
                labelClass={labelClass}
              />
            )}
          </div>

          {/* Footer */}
          {!published && (
            <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => step > 1 && setStep(s => s - 1)}
                className={`text-sm text-neutral-500 hover:text-neutral-800 transition-colors ${step === 1 ? 'invisible' : ''}`}
              >
                Back
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                  className="px-5 py-2 text-sm font-medium bg-[#eb3403] text-white rounded hover:bg-[#c42d02] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={thumbUploading}
                  className="px-5 py-2 text-sm font-medium bg-[#eb3403] text-white rounded hover:bg-[#c42d02] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Publish Project
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

/* ── Step sub-components ── */

interface PreviewData {
  loading: boolean
  error: string | null
  screenshotUrl?: string
  ogImageUrl?: string
  title?: string
  description?: string
}

function StepOne({ liveUrl, setLiveUrl, onBlurNormalize, preview, inputClass, labelClass }: {
  liveUrl: string
  setLiveUrl: (v: string) => void
  onBlurNormalize: () => void
  preview: PreviewData
  inputClass: string
  labelClass: string
}) {
  // Best image to show in the preview panel
  const previewImage = preview.screenshotUrl ?? preview.ogImageUrl

  return (
    <>
      <div>
        <label className={labelClass}>Project URL</label>
        <input
          type="text"
          value={liveUrl}
          onChange={e => setLiveUrl(e.target.value)}
          onBlur={onBlurNormalize}
          placeholder="yourproject.vercel.app"
          className={inputClass}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <p className="mt-1.5 text-[11px] text-neutral-400 leading-relaxed">
          Paste any link — Vercel, Netlify, Lovable, Replit, Framer, Webflow, Figma,
          GitHub Pages, staging URLs, custom domains. No https:// required.
        </p>
      </div>

      {liveUrl && (
        <div className="rounded-md border border-neutral-200 overflow-hidden">
          <div className="h-36 bg-neutral-50 relative flex items-center justify-center">
            {preview.loading && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
                <span className="text-xs text-neutral-400">Fetching preview…</span>
              </div>
            )}
            {!preview.loading && preview.error && (
              <div className="flex flex-col items-center gap-1.5 text-center px-4">
                <span className="text-lg">🔗</span>
                <span className="text-xs text-neutral-500 font-medium">Link saved — no preview available</span>
                <span className="text-[11px] text-neutral-400">You can upload a screenshot manually in the next step</span>
              </div>
            )}
            {!preview.loading && !preview.error && previewImage && (
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover object-top" />
            )}
            {!preview.loading && !preview.error && !previewImage && liveUrl && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-sm">✓</div>
                <span className="text-xs text-neutral-500">Link accepted</span>
              </div>
            )}
          </div>
          {(preview.title || preview.description) && (
            <div className="px-3 py-2.5 border-t border-neutral-100">
              {preview.title && <p className="text-xs font-medium text-neutral-700 truncate">{preview.title}</p>}
              {preview.description && <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">{preview.description}</p>}
            </div>
          )}
        </div>
      )}
    </>
  )
}

function StepTwo({ name, setName, description, setDescription, category, setCategory, tool, setTool, codeUrl, setCodeUrl, inputClass, labelClass }: {
  name: string; setName: (v: string) => void
  description: string; setDescription: (v: string) => void
  category: string; setCategory: (v: string) => void
  tool: string; setTool: (v: string) => void
  codeUrl: string; setCodeUrl: (v: string) => void
  inputClass: string; labelClass: string
}) {
  return (
    <>
      <div>
        <label className={labelClass}>Project name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. FinanceFlow" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Short description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What does your project do?"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>
      <div>
        <label className={labelClass}>Category</label>
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded transition-all ${category === cat ? 'bg-[#eb3403] text-white' : 'border border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>Built with</label>
        <div className="grid grid-cols-5 gap-1.5">
          {tools.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTool(t)}
              className={`py-2 text-[11px] rounded border transition-all ${tool === t ? 'bg-[#eb3403] text-white border-[#eb3403]' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>GitHub / source URL <span className="text-neutral-400 font-normal">(optional)</span></label>
        <input value={codeUrl} onChange={e => setCodeUrl(e.target.value)} placeholder="https://github.com/you/project" className={inputClass} />
      </div>
    </>
  )
}

interface StepThreeProps {
  tagInput: string; setTagInput: (v: string) => void
  tags: string[]; setTags: (v: string[]) => void
  addTag: () => void
  thumbnail: string | null
  setThumbnail: (v: string | null) => void
  thumbUploading: boolean
  thumbError: string | null
  thumbOriginalSize: number
  thumbCompressedKb: number
  isDragging: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDrop: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: () => void
  autoPreviewUrl?: string
  inputClass: string
  labelClass: string
}

function StepThree({
  tagInput, setTagInput, tags, setTags, addTag,
  thumbnail, setThumbnail,
  thumbUploading, thumbError, thumbOriginalSize, thumbCompressedKb,
  isDragging, fileInputRef,
  handleFileInput, handleDrop, handleDragOver, handleDragLeave,
  autoPreviewUrl,
  inputClass, labelClass,
}: StepThreeProps) {
  return (
    <>
      {/* Tags */}
      <div>
        <label className={labelClass}>
          <Tag className="w-3 h-3 inline mr-1 text-neutral-400" />
          Tags <span className="text-neutral-400 font-normal">(up to 6)</span>
        </label>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="e.g. AI, Dashboard"
            className={`${inputClass} flex-1`}
          />
          <button
            onClick={addTag}
            className="px-3 text-xs border border-neutral-200 rounded text-neutral-600 hover:border-neutral-400 transition-all"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map(tag => (
              <span
                key={tag}
                onClick={() => setTags(tags.filter(t => t !== tag))}
                className="text-xs px-2.5 py-1 rounded-sm bg-neutral-100 border border-neutral-200 text-neutral-600 cursor-pointer hover:bg-neutral-200 transition-colors select-none"
              >
                {tag} ×
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail upload */}
      <div>
        <label className={labelClass}>
          <ImageIcon className="w-3 h-3 inline mr-1 text-neutral-400" />
          Thumbnail
          {autoPreviewUrl && !thumbnail && (
            <span className="ml-1.5 text-neutral-400 font-normal">
              — auto-generated if skipped
            </span>
          )}
        </label>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInput}
        />

        {thumbnail ? (
          /* Preview of uploaded image */
          <div className="relative rounded-md border border-neutral-200 overflow-hidden">
            <img
              src={thumbnail}
              alt="Thumbnail preview"
              className="w-full h-44 object-cover object-top"
            />
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium bg-white text-neutral-800 rounded shadow hover:bg-neutral-50 transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => setThumbnail(null)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded shadow hover:bg-neutral-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-neutral-600" />
              </button>
            </div>
            {/* Size badge */}
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded">
              {thumbCompressedKb} KB
              {thumbOriginalSize > 0 && (
                <span className="opacity-60 ml-1">
                  (was {formatBytes(thumbOriginalSize)})
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Drop zone */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-md p-8 flex flex-col items-center gap-2.5 cursor-pointer transition-all select-none ${
              isDragging
                ? 'border-neutral-500 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/50'
            }`}
          >
            {thumbUploading ? (
              <>
                <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
                <span className="text-xs text-neutral-500">Compressing image…</span>
              </>
            ) : isDragging ? (
              <>
                <Upload className="w-5 h-5 text-neutral-500" />
                <span className="text-xs text-neutral-600 font-medium">Drop to upload</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-neutral-400" />
                <span className="text-xs text-neutral-500">
                  Drop image or{' '}
                  <span className="text-neutral-700 underline underline-offset-2">browse</span>
                </span>
                <span className="text-[10px] text-neutral-400">JPG, PNG, WEBP · max 20 MB · auto-compressed</span>
              </>
            )}
          </div>
        )}

        {/* Upload error */}
        {thumbError && (
          <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            {thumbError}
          </p>
        )}

        {/* Auto-preview fallback notice */}
        {!thumbnail && autoPreviewUrl && (
          <div className="mt-2 rounded-md border border-neutral-100 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border-b border-neutral-100">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium">Auto-generated preview</span>
            </div>
            <img
              src={autoPreviewUrl}
              alt="Auto preview"
              className="w-full h-24 object-cover object-top opacity-80"
            />
          </div>
        )}
      </div>
    </>
  )
}
