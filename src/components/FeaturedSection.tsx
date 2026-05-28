import { Heart, Eye, ExternalLink, ArrowRight } from 'lucide-react'
import { type Project } from '@/data/projects'

interface FeaturedSectionProps {
  projects: Project[]
  onProjectClick: (p: Project) => void
}

function FeaturedCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  const hasLive = project.liveUrl && project.liveUrl !== '#'
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className="group relative overflow-hidden border border-neutral-200 hover:border-neutral-900 bg-white cursor-pointer card-interactive rounded-none"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-50">
        {project.screenshotUrl ? (
          <img
            src={project.screenshotUrl}
            alt={project.title}
            className="thumb-zoom w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <FeaturedPlaceholder project={project} />
        )}

        {/* Index number */}
        <div className="absolute top-0 left-0 z-10">
          <span className="flex items-center justify-center w-9 h-9 bg-neutral-900 text-white text-[10px] font-black tracking-wider">
            {num}
          </span>
        </div>

        {/* Featured pill */}
        <div className="absolute top-0 right-0 z-10">
          <span className="flex items-center px-2.5 py-1.5 bg-[#eb3403] text-white text-[9px] font-black uppercase tracking-[0.15em]">
            Featured
          </span>
        </div>

        {/* Hover overlay */}
        <div className="overlay-fade absolute inset-0 bg-black/45 flex items-center justify-center">
          <span className="slide-up text-white text-[10px] font-black uppercase tracking-widest bg-neutral-900 px-5 py-2.5">
            View →
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-[14px] font-bold text-neutral-900 leading-tight tracking-tight">{project.title}</h3>
          <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.15em] text-neutral-400 mt-0.5 border border-neutral-200 px-1.5 py-0.5">
            {project.tool}
          </span>
        </div>

        <p className="text-[12px] text-neutral-500 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
              style={{ backgroundColor: project.creator.color }}
            >
              {project.creator.initials}
            </div>
            <span className="text-[11px] text-neutral-500 truncate font-medium">{project.creator.name}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Heart className="w-3 h-3" />
              {project.likes >= 1000 ? `${(project.likes / 1000).toFixed(1)}k` : project.likes}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Eye className="w-3 h-3" />{project.views}
            </span>
            {hasLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="overlay-fade text-neutral-400 hover:text-[#eb3403] transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function FeaturedPlaceholder({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute inset-0" style={{ backgroundColor: project.accentColor, opacity: 0.06 }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-black text-neutral-200">{project.title[0]}</span>
      </div>
    </div>
  )
}

export function FeaturedSection({ projects, onProjectClick }: FeaturedSectionProps) {
  const featured = projects.filter(p => p.trending || p.featured).slice(0, 3)
  if (featured.length < 2) return null

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-10 sm:py-12">

        {/* Section header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-4">
            <div className="w-[3px] h-6 bg-[#eb3403]" />
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.22em] text-neutral-400 mb-0.5">
                Curated picks
              </p>
              <h2 className="text-[13px] font-black text-neutral-900 uppercase tracking-[0.1em]">
                Featured This Week
              </h2>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => (
            <FeaturedCard
              key={p.id}
              project={p}
              index={i}
              onClick={() => onProjectClick(p)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
