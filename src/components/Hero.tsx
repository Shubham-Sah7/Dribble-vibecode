import { useState } from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  onExplore: () => void
  onUpload: (url?: string) => void
}

const stats = [
  { value: '1,200+', label: 'Projects' },
  { value: '4,800+', label: 'Builders' },
  { value: '89k',    label: 'Monthly Views' },
]

export function Hero({ onExplore, onUpload }: HeroProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpload(url)
  }

  return (
    <section className="bg-white border-b border-neutral-100">
      <motion.div
        className="max-w-2xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >

        {/* Heading */}
        <h1 className="text-[2.75rem] sm:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.05] mb-5">
          Discover products<br />built with AI.
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-md mx-auto mb-10">
          Explore projects built with Lovable, Cursor, Bolt, v0,<br className="hidden sm:block" /> and modern AI tools.
        </p>

        {/* Inline input + button */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch max-w-sm mx-auto mb-10 border border-neutral-200 rounded-md overflow-hidden bg-white focus-within:border-neutral-400 transition-colors"
        >
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste your project link"
            className="flex-1 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none bg-transparent min-w-0"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 active:bg-neutral-800 transition-colors whitespace-nowrap border-t sm:border-t-0 sm:border-l border-neutral-200"
          >
            Submit Project
          </button>
        </form>

        {/* Stats */}
        <div className="flex items-center justify-center gap-5 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-5 sm:gap-8">
              <div className="text-center">
                <span className="text-sm font-semibold text-neutral-900">{stat.value}</span>
                <span className="text-sm text-neutral-400 ml-1.5">{stat.label}</span>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-3 bg-neutral-200 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Browse link */}
        <button
          onClick={onExplore}
          className="mt-8 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          Browse all projects ↓
        </button>

      </motion.div>
    </section>
  )
}
