import { useState } from 'react'
import { Heart, Eye, Bookmark, ExternalLink, Expand } from 'lucide-react'
import { type Project } from '@/data/projects'

/* ── Placeholder when no screenshot ──────────────────────────────── */
function PlaceholderThumb({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="absolute inset-0" style={{ backgroundColor: project.accentColor, opacity: 0.07 }} />
      {/* Faint initial */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-6xl font-black select-none"
          style={{ color: project.accentColor, opacity: 0.12 }}
        >
          {project.title[0]}
        </span>
      </div>
      {/* Minimal top bar */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-white/70 border-b border-neutral-200/60 flex items-center px-2.5 gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="ml-1 flex-1 h-2.5 bg-neutral-200/80 rounded-sm max-w-[80px]" />
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
    <article className="group bg-white border border-neutral-100 hover:border-neutral-200/80 rounded-xl overflow-hidden card-lift cursor-default">

      {/* ── Thumbnail — always 3/2 ─────────────────────────────── */}
      <div
        className={`relative overflow-hidden aspect-[3/2] bg-neutral-50 ${onClick ? 'cursor-pointer' : ''}`}
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

        {/* Tool pill — bottom left, always visible */}
        <div className="absolute bottom-2 left-2 z-20">
          <span className="text-[10px] font-medium text-neutral-600 bg-white/90 px-1.5 py-0.5 rounded-sm shadow-sm">
            {project.tool}
          </span>
        </div>

        {/* Bookmark — top right, on hover */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(!saved) }}
          className="overlay-fade absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded bg-white/90 border border-neutral-200/60 flex items-center justify-center shadow-sm hover:bg-white transition-all"
          aria-label="Save"
        >
          <Bookmark className={`w-3 h-3 ${saved ? 'fill-neutral-800 text-neutral-800' : 'text-neutral-400'}`} />
        </button>

        {/* Hover overlay — dark, with centered action */}
        <div className="overlay-fade absolute inset-0 bg-black/35 flex items-center justify-center gap-2 z-10">
          {onClick && (
            <button
              onClick={onClick}
              className="slide-up inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white text-neutral-900 rounded hover:bg-neutral-100 transition-colors shadow"
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
              className="slide-up inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#eb3403] text-white rounded hover:bg-[#c42d02] transition-colors shadow"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          )}
        </div>
      </div>

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className="px-4 py-3">

        {/* Title */}
        <h3
          className={`text-[13px] font-semibold text-neutral-900 leading-snug mb-1 ${onClick ? 'cursor-pointer hover:text-[#eb3403] transition-colors' : ''}`}
          onClick={onClick}
        >
          {project.title}
        </h3>

        {/* Description — 1 line */}
        <p className="text-[11px] text-neutral-400 line-clamp-1 leading-relaxed mb-3">
          {project.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          {/* Creator */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
              style={{ backgroundColor: project.creator.color }}
            >
              {project.creator.initials}
            </div>
            <span className="text-[11px] text-neutral-500 truncate">{project.creator.name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
              className={`flex items-center gap-1 text-[11px] transition-colors ${liked ? 'text-[#eb3403]' : 'text-neutral-400 hover:text-neutral-600'}`}
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
