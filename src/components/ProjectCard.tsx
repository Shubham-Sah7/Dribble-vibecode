import { useState } from 'react'
import { Heart, Eye, Bookmark, ExternalLink, Expand } from 'lucide-react'
import { type Project } from '@/data/projects'

/* ── Placeholder when no screenshot ──────────────────────────────── */
function PlaceholderThumb({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute inset-0" style={{ backgroundColor: project.accentColor, opacity: 0.05 }} />
      {/* Faint initial */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-7xl font-black select-none"
          style={{ color: project.accentColor, opacity: 0.10 }}
        >
          {project.title[0]}
        </span>
      </div>
      {/* Minimal browser bar */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-white/70 border-b border-neutral-200/60 flex items-center px-2.5 gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="ml-1 flex-1 h-2 bg-neutral-200/80 max-w-[80px]" />
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [liked,     setLiked    ] = useState(false)
  const [saved,     setSaved    ] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes)
  const [imgError,  setImgError ] = useState(false)

  const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#'
  const showPhoto  = !imgError && !!project.screenshotUrl

  return (
    <article className="group bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-150 hover:-translate-y-[2px] cursor-default rounded-none overflow-hidden">

      {/* ── Thumbnail ─────────────────────────────────────────── */}
      <div
        className={`relative overflow-hidden aspect-[16/10] bg-neutral-50 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {showPhoto ? (
          <img
            src={project.screenshotUrl}
            alt={project.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="thumb-zoom w-full h-full object-cover object-top"
          />
        ) : (
          <PlaceholderThumb project={project} />
        )}

        {/* Tool pill — bottom left, structural */}
        <div className="absolute bottom-0 left-0 z-20">
          <span className="text-[9px] font-black uppercase tracking-wider text-white bg-neutral-900 px-2.5 py-1">
            {project.tool}
          </span>
        </div>

        {/* Bookmark — top right, on hover */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(!saved) }}
          className="overlay-fade absolute top-2.5 right-2.5 z-20 w-7 h-7 bg-white border border-neutral-200 hover:border-neutral-900 flex items-center justify-center transition-all rounded-none"
          aria-label="Save"
        >
          <Bookmark className={`w-3 h-3 ${saved ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-400'}`} />
        </button>

        {/* Hover overlay */}
        <div className="overlay-fade absolute inset-0 bg-black/50 flex items-center justify-center gap-2.5 z-10">
          {onClick && (
            <button
              onClick={onClick}
              className="slide-up inline-flex items-center gap-1.5 px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-white text-neutral-900 hover:bg-neutral-100 transition-colors rounded-none"
            >
              <Expand className="w-3 h-3" />
              Preview
            </button>
          )}
          {hasLiveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="slide-up inline-flex items-center gap-1.5 px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-[#eb3403] text-white hover:bg-[#c42d02] transition-colors rounded-none"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          )}
        </div>
      </div>

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className="border-t border-neutral-200">

        {/* Title + description */}
        <div className="px-4 pt-3.5 pb-3">
          <h3
            className={`text-[13px] font-bold text-neutral-900 leading-snug tracking-tight mb-1 ${onClick ? 'cursor-pointer hover:text-[#eb3403] transition-colors' : ''}`}
            onClick={onClick}
          >
            {project.title}
          </h3>
          <p className="text-[11px] text-neutral-400 line-clamp-1 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Meta footer */}
        <div className="px-4 py-2.5 flex items-center justify-between border-t border-neutral-100">
          {/* Creator */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
              style={{ backgroundColor: project.creator.color }}
            >
              {project.creator.initials}
            </div>
            <span className="text-[11px] text-neutral-500 truncate font-medium">{project.creator.name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
              className={`flex items-center gap-1 text-[11px] transition-colors ${liked ? 'text-[#eb3403]' : 'text-neutral-400 hover:text-neutral-700'}`}
            >
              <Heart className={`w-3 h-3 ${liked ? 'fill-[#eb3403]' : ''}`} />
              {fmtNum(likeCount)}
            </button>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Eye className="w-3 h-3" />
              {project.views}
            </span>
          </div>
        </div>

      </div>
    </article>
  )
}
