import { Heart, Eye, ExternalLink } from 'lucide-react'
import { type Project } from '@/data/projects'

interface FeaturedSectionProps {
  projects: Project[]
  onProjectClick: (p: Project) => void
}

function FeaturedCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const hasLive = project.liveUrl && project.liveUrl !== '#'

  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-neutral-100 hover:border-neutral-200 bg-white cursor-pointer card-lift"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-50">
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

        {/* Featured badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#eb3403] text-white text-[10px] font-semibold rounded-sm uppercase tracking-wide">
            Featured
          </span>
        </div>

        {/* Hover overlay */}
        <div className="overlay-fade absolute inset-0 bg-black/30 flex items-center justify-center">
          <span className="slide-up text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-sm">
            View Product →
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug">{project.title}</h3>
          <span className="shrink-0 text-[10px] text-neutral-400 mt-0.5 font-medium">{project.tool}</span>
        </div>

        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
              style={{ backgroundColor: project.creator.color }}
            >
              {project.creator.initials}
            </div>
            <span className="text-xs text-neutral-500 truncate">{project.creator.name}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Heart className="w-3 h-3" />{project.likes >= 1000 ? `${(project.likes / 1000).toFixed(1)}k` : project.likes}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
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
      <div className="absolute inset-0" style={{ backgroundColor: project.accentColor, opacity: 0.08 }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black text-neutral-200">{project.title[0]}</span>
      </div>
    </div>
  )
}

export function FeaturedSection({ projects, onProjectClick }: FeaturedSectionProps) {
  const featured = projects.filter(p => p.trending || p.featured).slice(0, 3)
  if (featured.length < 2) return null

  return (
    <section className="border-b border-neutral-100 bg-white">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 py-10 sm:py-12">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-[#eb3403] rounded-full" />
            <h2 className="text-[13px] font-semibold text-neutral-900 uppercase tracking-wider">
              Featured this week
            </h2>
          </div>
          <span className="text-xs text-neutral-400">{featured.length} picks</span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(p => (
            <FeaturedCard
              key={p.id}
              project={p}
              onClick={() => onProjectClick(p)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
