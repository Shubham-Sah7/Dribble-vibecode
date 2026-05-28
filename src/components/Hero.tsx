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
    <section className="bg-white border-b border-neutral-200 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="py-14 sm:py-18 lg:py-20 flex items-center gap-14 lg:gap-20">

          {/* ── Left column ──────────────────────────────────────── */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-[2px] bg-[#eb3403] shrink-0" />
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.22em]">
                Product Gallery
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.6rem] font-black text-neutral-900 tracking-[-0.03em] leading-[0.95] mb-6">
              The internet's gallery<br />
              for shipped{' '}
              <span className="text-[#eb3403]">products.</span>
            </h1>

            {/* Subtext */}
            <p className="text-[15px] sm:text-base text-neutral-500 leading-relaxed max-w-sm mb-8">
              Browse launched products, MVPs, side projects, and experiments
              from makers worldwide.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 mb-10">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#eb3403] transition-colors rounded-none"
              >
                Browse Gallery
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpload()}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors rounded-none"
              >
                Submit Yours
              </button>
            </div>

            {/* Tool badges */}
            <div className="mb-10">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">
                Built by makers using
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TOOL_BADGES.map(tool => (
                  <span
                    key={tool}
                    className="text-[10px] font-semibold text-neutral-600 px-2.5 py-1 border border-neutral-200 hover:border-neutral-900 hover:text-neutral-900 transition-all cursor-default rounded-none"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-stretch border-t-2 border-neutral-900 pt-6 gap-0">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex-1 ${i > 0 ? 'border-l border-neutral-200 pl-6' : ''}`}
                >
                  <div className="text-[1.5rem] font-black text-neutral-900 tabular-nums tracking-tight leading-none">
                    {s.value}
                  </div>
                  <div className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] mt-2">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right column — product mosaic ─────────────────────── */}
          {mosaic.length >= 4 && (
            <motion.div
              className="hidden lg:grid grid-cols-2 gap-2 w-[420px] xl:w-[500px] shrink-0"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
            >
              {mosaic.map((p, i) => (
                <div
                  key={p.id}
                  className={`mosaic-card relative overflow-hidden bg-neutral-100 border border-neutral-200 cursor-pointer rounded-none ${i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-[4/3]'}`}
                >
                  <img
                    src={p.screenshotUrl}
                    alt={p.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Hover label */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/35 transition-colors flex items-end p-2.5 opacity-0 hover:opacity-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white bg-neutral-900 px-2.5 py-1.5">
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
