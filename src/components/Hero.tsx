import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/data/projects'

interface HeroProps {
  onExplore: () => void
  onUpload: (url?: string) => void
}

const STATS = [
  { value: '1,200+', label: 'Products'      },
  { value: '4,800+', label: 'Makers'        },
  { value: '89k',    label: 'Monthly views' },
]

const INTERVAL_MS = 3600

export function Hero({ onExplore, onUpload }: HeroProps) {
  // Use projects that have real screenshots
  const showcase = projects.filter(p => p.screenshotUrl)
  const [idx,      setIdx     ] = useState(0)
  const [paused,   setPaused  ] = useState(false)
  const [progress, setProgress] = useState(0)

  const current = showcase[idx] ?? showcase[0]

  // Auto-advance + progress bar
  useEffect(() => {
    if (paused || showcase.length === 0) return
    setProgress(0)

    const step = 50  // ms per tick
    const ticks = INTERVAL_MS / step
    let tick = 0

    const interval = setInterval(() => {
      tick++
      setProgress((tick / ticks) * 100)
      if (tick >= ticks) {
        setIdx(i => (i + 1) % showcase.length)
        tick = 0
        setProgress(0)
      }
    }, step)

    return () => clearInterval(interval)
  }, [idx, paused, showcase.length])

  if (showcase.length === 0) return null

  return (
    <section className="bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20">
        <div className="py-16 sm:py-20 lg:py-24 flex items-center gap-12 lg:gap-20">

          {/* ── Left column ──────────────────────────────────────────── */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-7 px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eb3403]" />
              <span className="text-[11px] font-medium text-neutral-500 tracking-wide">
                Product Gallery
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2.5rem] sm:text-[3.1rem] lg:text-[3.6rem] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.05] mb-5">
              The internet's<br className="hidden lg:block" /> gallery for<br className="hidden lg:block" /> shipped products.
            </h1>

            {/* Sub-copy */}
            <p className="text-[15px] sm:text-base text-neutral-500 leading-relaxed max-w-[400px] mb-9">
              Browse launched products, MVPs, side projects, and experiments from makers worldwide.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 mb-11">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Browse Gallery
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpload()}
                className="px-5 py-2.5 text-[13px] font-semibold text-neutral-600 border border-neutral-200 rounded-lg hover:border-neutral-400 hover:text-neutral-900 transition-all"
              >
                Submit yours
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-stretch gap-8 pt-7 border-t border-neutral-100">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="text-[1.35rem] font-bold text-neutral-900 tabular-nums tracking-tight leading-none">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right column — single product showcase ────────────────── */}
          <motion.div
            className="hidden lg:flex flex-col w-[500px] xl:w-[560px] shrink-0"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
          >
            {/* Product frame */}
            <div
              className="relative rounded-xl overflow-hidden border border-neutral-200 shadow-[0_24px_64px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Browser chrome */}
              <div className="h-9 bg-[#f5f5f5] border-b border-neutral-200 flex items-center px-3.5 gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e0e0e0]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e0e0e0]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e0e0e0]" />
                </div>
                <div className="flex-1 mx-2">
                  <div className="h-5 bg-white border border-neutral-200/80 rounded flex items-center px-2.5 max-w-[180px]">
                    <span className="text-[10px] text-neutral-400 truncate select-none">
                      productgallery.so/{current.creator.username}
                    </span>
                  </div>
                </div>
              </div>

              {/* Screenshot */}
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={idx}
                    src={current.screenshotUrl}
                    alt={current.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  />
                </AnimatePresence>

                {/* Bottom gradient + product info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent pt-12 pb-4 px-4 z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white text-[14px] font-semibold leading-tight drop-shadow-sm">
                        {current.title}
                      </p>
                      <p className="text-white/65 text-[11px] mt-0.5">
                        {current.creator.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded">
                      {current.tool}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar at very bottom of frame */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/10 z-20">
                <motion.div
                  className="h-full bg-white/70"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0 }}
                />
              </div>
            </div>

            {/* Navigation dots + counter */}
            <div className="flex items-center justify-between mt-4 px-0.5">
              <div className="flex items-center gap-1.5">
                {showcase.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIdx(i); setProgress(0) }}
                    className={`transition-all duration-300 rounded-full ${
                      i === idx
                        ? 'w-5 h-[5px] bg-neutral-900'
                        : 'w-[5px] h-[5px] bg-neutral-300 hover:bg-neutral-500'
                    }`}
                    aria-label={`Show product ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-neutral-400 tabular-nums select-none">
                {idx + 1} / {showcase.length}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
