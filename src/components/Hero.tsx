import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/data/projects'

interface HeroProps {
  onExplore: () => void
  onUpload: (url?: string) => void
}

const TOOL_BADGES = ['Lovable', 'Cursor', 'Bolt', 'v0', 'Windsurf', 'Claude', 'Replit', 'Framer']

const STATS = [
  { value: '1,200+', label: 'Products'      },
  { value: '4,800+', label: 'Makers'        },
  { value: '89k',    label: 'Monthly views' },
]

export function Hero({ onExplore, onUpload }: HeroProps) {
  const mosaic = projects.filter(p => p.screenshotUrl).slice(0, 6)

  return (
    <section className="bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        <div className="py-16 sm:py-20 lg:py-24 flex items-center gap-14 lg:gap-20">

          {/* ── Left column ──────────────────────────────────────── */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eb3403]" />
              <span className="text-[11px] font-medium text-neutral-500 tracking-wide">
                Product Gallery
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.75rem] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.0] mb-5">
              The internet's gallery<br />
              for shipped products.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-[17px] text-neutral-500 leading-relaxed max-w-[420px] mb-8">
              Browse launched products, MVPs, side projects, and experiments
              from makers worldwide.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 mb-10">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Browse Gallery
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpload()}
                className="px-5 py-2.5 text-[13px] font-semibold text-neutral-700 border border-neutral-200 rounded-lg hover:border-neutral-400 hover:text-neutral-900 transition-all"
              >
                Submit yours
              </button>
            </div>

            {/* Tool badges */}
            <div className="mb-10">
              <p className="text-[11px] text-neutral-400 mb-2.5 font-medium">Built by makers using</p>
              <div className="flex flex-wrap gap-1.5">
                {TOOL_BADGES.map(tool => (
                  <span
                    key={tool}
                    className="text-[11px] font-medium text-neutral-600 px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-md hover:border-neutral-400 hover:text-neutral-900 transition-all cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-stretch gap-8 pt-8 border-t border-neutral-100">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="text-[1.4rem] font-bold text-neutral-900 tabular-nums tracking-tight leading-none">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right column — product mosaic ─────────────────────── */}
          {mosaic.length >= 4 && (
            <motion.div
              className="hidden lg:grid grid-cols-2 gap-2.5 w-[420px] xl:w-[500px] shrink-0"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
              {mosaic.map((p, i) => (
                <div
                  key={p.id}
                  className={`mosaic-card relative overflow-hidden bg-neutral-100 rounded-xl border border-neutral-200/60 cursor-pointer ${i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-[4/3]'}`}
                >
                  <img
                    src={p.screenshotUrl}
                    alt={p.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-colors flex items-end p-2.5 opacity-0 hover:opacity-100">
                    <span className="text-[10px] font-semibold text-white bg-black/60 px-2 py-1 rounded-sm backdrop-blur-sm">
                      {p.title}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </section>
  )
}
