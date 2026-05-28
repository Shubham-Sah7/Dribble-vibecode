import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/data/projects'

interface HeroProps {
  onExplore: () => void
  onUpload: (url?: string) => void
}

const TOOL_BADGES = ['Lovable', 'Cursor', 'Bolt', 'v0', 'Windsurf', 'Claude', 'Replit', 'Vercel']

const STATS = [
  { value: '1,200+', label: 'Products' },
  { value: '4,800+', label: 'Builders'  },
  { value: '89k',    label: 'Monthly views' },
]

export function Hero({ onExplore, onUpload }: HeroProps) {
  // Pick 6 visually rich projects for the mosaic
  const mosaic = projects.filter(p => p.screenshotUrl).slice(0, 6)

  return (
    <section className="bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
        <div className="py-16 sm:py-20 lg:py-24 flex items-center gap-12 lg:gap-16">

          {/* ── Left column ─────────────────────────────────────── */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#eb3403]" />
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
                Product Gallery
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2.4rem] sm:text-5xl lg:text-[3.5rem] font-bold text-neutral-900 tracking-tight leading-[1.06] mb-5">
              The internet's gallery<br />
              for shipped products.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-[17px] text-neutral-500 leading-relaxed max-w-md mb-9">
              Browse live websites, SaaS tools, apps, and experiments
              shared by designers, developers, and indie makers worldwide.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 mb-10">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#eb3403] text-white text-sm font-medium rounded hover:bg-[#c42d02] active:bg-[#a82602] transition-colors"
              >
                Explore Gallery
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpload()}
                className="px-5 py-2.5 text-sm font-medium text-neutral-700 border border-neutral-200 rounded hover:border-neutral-400 hover:text-neutral-900 transition-colors"
              >
                Submit yours
              </button>
            </div>

            {/* Tool badges */}
            <div>
              <p className="text-[11px] text-neutral-400 mb-2.5">Built by makers using</p>
              <div className="flex flex-wrap gap-1.5">
                {TOOL_BADGES.map(tool => (
                  <span
                    key={tool}
                    className="text-[11px] font-medium text-neutral-600 px-2.5 py-1 bg-neutral-100 rounded-sm hover:bg-neutral-200 transition-colors cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-7 mt-10 pt-8 border-t border-neutral-100">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="text-[15px] font-bold text-neutral-900 tabular-nums">{s.value}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right column — product mosaic ────────────────────── */}
          {mosaic.length >= 4 && (
            <motion.div
              className="hidden lg:grid grid-cols-2 gap-3 w-[420px] xl:w-[480px] shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            >
              {mosaic.map((p, i) => (
                <div
                  key={p.id}
                  className={`mosaic-card relative overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200/60 cursor-pointer ${i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-[4/3]'}`}
                >
                  <img
                    src={p.screenshotUrl}
                    alt={p.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Hover label */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end p-2.5 opacity-0 hover:opacity-100">
                    <span className="text-[11px] font-semibold text-white bg-black/50 px-2 py-0.5 rounded-sm">
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
