import { useState } from 'react'
import { Heart, Eye, Bookmark, ExternalLink, Expand } from 'lucide-react'
import { type Project } from '@/data/projects'

/* ── Placeholder when no screenshot ──────────────────────────────── */
function PlaceholderThumb({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="absolute inset-0" style={{ backgroundColor: project.accentColor, opacity: 0.06 }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-6xl font-bold select-none"
          style={{ color: project.accentColor, opacity: 0.12 }}
        >
          {project.title[0]}
        </span>
      </div>
      {/* Browser chrome hint */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-white/60 border-b border-neutral-200/50 flex items-center px-2.5 gap-1.5">
        <div className="w-2 h-2 rounded-full bg-neutral-200" />
        <div className="w-2 h-2 rounded-full bg-neutral-200" />
        <div className="w-2 h-2 rounded-full bg-neutral-200" />
        <div className="ml-2 flex-1 h-2 bg-neutral-200/70 rounded-sm max-w-[90px]" />
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
    <article className="group bg-white border border-neutral-100 rounded-xl overflow-hidden card-lift cursor-default">

      {/* ── Thumbnail ─────────────────────────────────────────── */}
      <div
        className={`relative overflow-hidden bg-neutral-50 ${onClick ? 'cursor-pointer' : ''}`}
        style={{ aspectRatio: '414 / 314' }}
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
        <div className="absolute bottom-2.5 left-2.5 z-20">
          <span className="text-[10px] font-medium text-neutral-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
            {project.tool}
          </span>
        </div>

        {/* Bookmark — top right, on hover */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(!saved) }}
          className="overlay-fade absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm border border-neutral-200/60 flex items-center justify-center shadow-sm hover:bg-white transition-all"
          aria-label="Save"
        >
          <Bookmark className={`w-3 h-3 ${saved ? 'fill-neutral-800 text-neutral-800' : 'text-neutral-400'}`} />
        </button>

        {/* Hover overlay — centered actions */}
        <div className="overlay-fade absolute inset-0 bg-black/30 flex items-center justify-center gap-2 z-10">
          {onClick && (
            <button
              onClick={onClick}
              className="slide-up inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors shadow-lg"
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
              className="slide-up inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold bg-[#eb3403] text-white rounded-lg hover:bg-[#c42d02] transition-colors shadow-lg"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          )}
        </div>
      </div>

      {/* ── Card title ────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-0">
        <h3
          className={`text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-1 ${onClick ? 'cursor-pointer hover:text-[#eb3403] transition-colors' : ''}`}
          onClick={onClick}
        >
          {project.title}
        </h3>
      </div>

      {/* ── Metadata row — Figma spec: 44px, SPACE_BETWEEN, 10px v-pad ── */}
      <div className="flex items-center justify-between px-4 py-[10px]">

        {/* Creator */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
            style={{ backgroundColor: project.creator.color }}
          >
            {project.creator.initials}
          </div>
          <span className="text-[13px] font-semibold text-neutral-700 truncate">
            {project.creator.name}
          </span>
        </div>

        {/* Stats — gap 9px between heart and eye groups */}
        <div className="flex items-center gap-[9px] shrink-0">
          <button
            onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
            className={`flex items-center gap-1 text-[12px] transition-colors ${liked ? 'text-[#eb3403]' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-[#eb3403]' : ''}`} />
            {fmtNum(likeCount)}
          </button>
          <span className="flex items-center gap-1 text-[12px] text-neutral-400">
            <Eye className="w-3.5 h-3.5" />
            {project.views}
          </span>
        </div>

      </div>
    </article>
  )
}
