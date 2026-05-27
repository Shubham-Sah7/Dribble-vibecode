import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Link, GitBranch, Tag, Image, Check } from 'lucide-react'

const tools = ['Lovable', 'Cursor', 'Bolt', 'v0', 'Replit', 'Vercel', 'Framer', 'Custom']
const categoryOptions = ['SaaS', 'AI Tools', 'Mobile', 'Finance', 'Healthcare', 'Productivity', 'Dev Tools', 'Design']

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', description: '', liveUrl: '', codeUrl: '',
    tool: '', category: '', tags: '', published: false
  })
  const [tagInput, setTagInput] = useState('')
  const [tagsList, setTagsList] = useState<string[]>([])

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (t && !tagsList.includes(t) && tagsList.length < 6) {
      setTagsList(prev => [...prev, t])
      setTagInput('')
    }
  }

  const handlePublish = () => {
    setForm(f => ({ ...f, published: true }))
    setTimeout(() => {
      onOpenChange(false)
      setStep(1)
      setForm({ name: '', description: '', liveUrl: '', codeUrl: '', tool: '', category: '', tags: '', published: false })
      setTagsList([])
    }, 1800)
  }

  const inputClass = "w-full bg-white border border-neutral-200 rounded px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
  const labelClass = "block text-xs font-medium text-neutral-600 mb-1.5"

  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        />

        {/* Modal */}
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

          {/* Steps */}
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
            {form.published ? (
              <motion.div
                className="py-10 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">Project submitted</h3>
                <p className="text-sm text-neutral-500">Your build is now live on Vibbl.</p>
              </motion.div>

            ) : step === 1 ? (
              <>
                <div>
                  <label className={labelClass}>Project name</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. FinanceFlow" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Short description</label>
                  <textarea
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
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
                        onClick={() => update('category', cat)}
                        className={`px-3 py-1.5 text-xs rounded transition-all ${form.category === cat ? 'bg-neutral-900 text-white' : 'border border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </>

            ) : step === 2 ? (
              <>
                <div>
                  <label className={labelClass}><Link className="w-3 h-3 inline mr-1 text-neutral-400" />Live URL</label>
                  <input value={form.liveUrl} onChange={e => update('liveUrl', e.target.value)} placeholder="https://your-project.vercel.app" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><GitBranch className="w-3 h-3 inline mr-1 text-neutral-400" />GitHub URL <span className="text-neutral-400 font-normal">(optional)</span></label>
                  <input value={form.codeUrl} onChange={e => update('codeUrl', e.target.value)} placeholder="https://github.com/you/project" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Built with</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {tools.map(tool => {
                      const isSelected = form.tool === tool
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => update('tool', tool)}
                          className={`py-2 text-xs rounded border transition-all ${isSelected ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                        >
                          {tool}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>

            ) : (
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
                  {tagsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tagsList.map(tag => (
                        <span
                          key={tag}
                          onClick={() => setTagsList(prev => prev.filter(t => t !== tag))}
                          className="text-xs px-2.5 py-1 rounded-sm bg-neutral-100 border border-neutral-200 text-neutral-600 cursor-pointer hover:bg-neutral-200 transition-colors"
                        >
                          {tag} ×
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}><Image className="w-3 h-3 inline mr-1 text-neutral-400" />Thumbnail</label>
                  <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded p-8 flex flex-col items-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 text-neutral-400" />
                    <span className="text-xs text-neutral-500">
                      Drop image or <span className="text-neutral-700 underline underline-offset-2">browse</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">PNG, JPG up to 5MB</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!form.published && (
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
                  disabled={step === 1 && !form.name.trim()}
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
