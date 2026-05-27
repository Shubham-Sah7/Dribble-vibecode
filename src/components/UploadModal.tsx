import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag, Image, Check, Loader2, AlertTriangle, Upload } from 'lucide-react'
import { useUrlPreview } from '@/hooks/useUrlPreview'
import { useProjects } from '@/context/ProjectsContext'
import { type Project } from '@/data/projects'

const tools = ['Lovable', 'Cursor', 'Bolt', 'v0', 'Replit', 'Vercel', 'Framer', 'Custom']
const categoryOptions = ['SaaS', 'AI Tools', 'Mobile', 'Finance', 'Healthcare', 'Productivity', 'Dev Tools', 'Design']

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefilledUrl?: string
}

function detectTool(url: string): string {
  try {
    const host = new URL(url).hostname
    if (host.includes('lovable')) return 'Lovable'
    if (host.includes('cursor')) return 'Cursor'
    if (host.includes('bolt')) return 'Bolt'
    if (host.includes('v0.dev')) return 'v0'
    if (host.includes('replit')) return 'Replit'
    if (host.includes('vercel.app') || host.includes('vercel.com')) return 'Vercel'
    if (host.includes('framer')) return 'Framer'
    if (host.includes('github.io')) return 'Custom'
  } catch { /* ignore */ }
  return ''
}

let nextId = Date.now()

export function UploadModal({ open, onOpenChange, prefilledUrl = '' }: UploadModalProps) {
  const { addProject } = useProjects()
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState(false)

  // Step 1
  const [liveUrl, setLiveUrl] = useState(prefilledUrl)

  // Step 2
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tool, setTool] = useState('')
  const [codeUrl, setCodeUrl] = useState('')

  // Step 3
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const preview = useUrlPreview(step >= 1 ? liveUrl : '')

  // Auto-fill from preview metadata
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
  }

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (t && !tags.includes(t) && tags.length < 6) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  const handlePublish = () => {
    const project: Project = {
      id: ++nextId,
      title: name || 'Untitled Project',
      description: description || 'A project built with AI tools.',
      category: category || 'SaaS',
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
      liveUrl,
      codeUrl,
      gradient: '',
      accentColor: '#6366f1',
      cardSize: 'normal',
      screenshotUrl: preview.screenshotUrl,
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
              <p className="text-xs text-neutral-400 mt-0.5">Share your vibe-coded build with the world</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step dots */}
          <div className="flex items-center px-6 pt-4 gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all border ${step >= s ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-400 border-neutral-200'}`}>
                  {step > s ? <Check className="w-2.5 h-2.5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-px mx-1.5 transition-all ${step > s ? 'bg-neutral-900' : 'bg-neutral-200'}`} />}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
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
                <p className="text-sm text-neutral-500">Your build is now live on Vibbl.</p>
              </motion.div>

            ) : step === 1 ? (
              <StepOne
                liveUrl={liveUrl}
                setLiveUrl={setLiveUrl}
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
                inputClass={inputClass} labelClass={labelClass}
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
                  className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white rounded hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white rounded hover:bg-neutral-700 transition-colors"
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
  title?: string
  description?: string
}

function StepOne({ liveUrl, setLiveUrl, preview, inputClass, labelClass }: {
  liveUrl: string
  setLiveUrl: (v: string) => void
  preview: PreviewData
  inputClass: string
  labelClass: string
}) {
  return (
    <>
      <div>
        <label className={labelClass}>Project URL</label>
        <input
          type="url"
          value={liveUrl}
          onChange={e => setLiveUrl(e.target.value)}
          placeholder="https://your-project.vercel.app"
          className={inputClass}
          autoFocus
        />
        <p className="mt-1.5 text-[11px] text-neutral-400">
          Works with Vercel, Lovable, Replit, GitHub Pages, and any live URL.
        </p>
      </div>

      {/* Preview panel */}
      {liveUrl && (
        <div className="rounded-md border border-neutral-200 overflow-hidden">
          <div className="h-36 bg-neutral-50 relative flex items-center justify-center">
            {preview.loading && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
                <span className="text-xs text-neutral-400">Generating preview…</span>
              </div>
            )}
            {!preview.loading && preview.error && (
              <div className="flex flex-col items-center gap-1.5 text-center px-4">
                <AlertTriangle className="w-4 h-4 text-neutral-300" />
                <span className="text-xs text-neutral-400">Preview unavailable — project will still be submitted</span>
              </div>
            )}
            {!preview.loading && !preview.error && preview.screenshotUrl && (
              <img
                src={preview.screenshotUrl}
                alt="Preview"
                className="w-full h-full object-cover object-top"
              />
            )}
            {!preview.loading && !preview.error && !preview.screenshotUrl && liveUrl && (
              <div className="flex flex-col items-center gap-1.5 text-center px-4">
                <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-sm">✓</div>
                <span className="text-xs text-neutral-500">URL looks valid</span>
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
              className={`px-3 py-1.5 text-xs rounded transition-all ${category === cat ? 'bg-neutral-900 text-white' : 'border border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>Built with</label>
        <div className="grid grid-cols-4 gap-1.5">
          {tools.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTool(t)}
              className={`py-2 text-xs rounded border transition-all ${tool === t ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>GitHub URL <span className="text-neutral-400 font-normal">(optional)</span></label>
        <input value={codeUrl} onChange={e => setCodeUrl(e.target.value)} placeholder="https://github.com/you/project" className={inputClass} />
      </div>
    </>
  )
}

function StepThree({ tagInput, setTagInput, tags, setTags, addTag, inputClass, labelClass }: {
  tagInput: string; setTagInput: (v: string) => void
  tags: string[]; setTags: (v: string[]) => void
  addTag: () => void
  inputClass: string; labelClass: string
}) {
  return (
    <>
      <div>
        <label className={labelClass}><Tag className="w-3 h-3 inline mr-1 text-neutral-400" />Tags <span className="text-neutral-400 font-normal">(up to 6)</span></label>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="e.g. AI, Dashboard"
            className={`${inputClass} flex-1`}
          />
          <button onClick={addTag} className="px-3 text-xs border border-neutral-200 rounded text-neutral-600 hover:border-neutral-400 transition-all">
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map(tag => (
              <span
                key={tag}
                onClick={() => setTags(tags.filter(t => t !== tag))}
                className="text-xs px-2.5 py-1 rounded-sm bg-neutral-100 border border-neutral-200 text-neutral-600 cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                {tag} ×
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}><Image className="w-3 h-3 inline mr-1 text-neutral-400" />Thumbnail <span className="text-neutral-400 font-normal">(optional — auto-generated if empty)</span></label>
        <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded p-8 flex flex-col items-center gap-2 transition-colors cursor-pointer">
          <Upload className="w-5 h-5 text-neutral-400" />
          <span className="text-xs text-neutral-500">
            Drop image or <span className="text-neutral-700 underline underline-offset-2">browse</span>
          </span>
          <span className="text-[10px] text-neutral-400">PNG, JPG up to 5MB</span>
        </div>
      </div>
    </>
  )
}
