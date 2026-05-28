import { useState } from 'react'
import { Heart, Eye, Bookmark, ExternalLink, Code2, Expand } from 'lucide-react'
import { type Project } from '@/data/projects'

/* ── Placeholder thumbnail when no screenshot exists ──────────────────────── */
function PlaceholderThumb({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6">
      <div className="dot-grid absolute inset-0 opacity-50" />
      {/* Accent tint */}
      <div className="absolute inset-0" style={{ backgroundColor: project.accentColor, opacity: 0.06 }} />
      {/* Browser chrome */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-white border-b border-neutral-200/80 flex items-center px-3 gap-2 z-10">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        </div>
        <div className="flex-1 h-3 bg-neutral-100 rounded-sm max-w-[120px]" />
      </div>
      {/* Skeleton content */}
      <div className="absolute top-7 left-0 right-0 bottom-0 p-4 flex flex-col gap-2.5">
        <div className="h-3 bg-neutral-200 rounded-sm w-2/5" />
        <div className="h-2 bg-neutral-200/70 rounded-sm w-full" />
        <div className="h-2 bg-neutral-200/50 rounded-sm w-4/5" />
        <div className="h-2 bg-neutral-200/40 rounded-sm w-3/5" />
        <div className="flex-1" />
        <div className="flex gap-2">
          <div className="h-7 w-20 rounded-md" style={{ backgroundColor: project.accentColor, opacity: 0.2 }} />
          <div className="h-7 flex-1 bg-neutral-200/50 rounded-md" />
        </div>
      </div>
    </div>
  )
}

/* ── Aspect ratio by card size ────────────────────────────────────────────── */
function aspectClass(cardSize: Project['cardSize']) {
  if (cardSize === 'square') return 'aspect-square'
  if (cardSize === 'tall')   return 'aspect-[4/3]'
  return 'aspect-[16/10]'
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

  const fmtLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#'
  const hasCodeUrl = project.codeUrl && project.codeUrl !== '#'
  const showPhoto  = !imgError && !!project.screenshotUrl

  return (
    <article className="group bg-white border border-neutral-100 hover:border-neutral-200 rounded-xl overflow-hidden card-lift cursor-default">

      {/* ── Thumbnail ── */}
      <div
        className={`relative overflow-hidden bg-neutral-50 ${aspectClass(project.cardSize)} ${onClick ? 'cursor-pointer' : ''}`}
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

        {/* Bookmark button — top right */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(!saved) }}
          className="overlay-fade absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-md bg-white/90 backdrop-blur-sm border border-neutral-200/80 flex items-center justify-center shadow-sm hover:bg-white transition-all"
          aria-label="Save"
        >
          <Bookmark className={`w-3 h-3 ${saved ? 'fill-neutral-800 text-neutral-800' : 'text-neutral-400'}`} />
        </button>

        {/* Hover overlay */}
        <div className="overlay-fade absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center gap-2 z-10">
          {onClick && (
            <button
              onClick={onClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#eb3403] text-white hover:bg-[#c42d02] transition-colors rounded shadow-sm"
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
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-colors rounded shadow-sm ${
                onClick
                  ? 'border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50'
                  : 'bg-[#eb3403] text-white hover:bg-[#c42d02]'
              }`}
            >
              <ExternalLink className="w-3 h-3" />
              Open Live
            </a>
          )}
          {hasCodeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors rounded-md shadow-sm"
            >
              <Code2 className="w-3 h-3" />
              Code
            </a>
          )}
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="px-4 py-3.5">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className={`text-[13px] font-semibold text-neutral-900 leading-snug ${onClick ? 'cursor-pointer hover:text-neutral-600 transition-colors' : ''}`}
            onClick={onClick}
          >
            {project.title}
          </h3>
          <span className="shrink-0 text-[10px] text-neutral-400 font-medium mt-0.5 whitespace-nowrap">
            {project.tool}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100">
          {/* Creator */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
              style={{ backgroundColor: project.creator.color }}
            >
              {project.creator.initials}
            </div>
            <span className="text-xs text-neutral-500 truncate">{project.creator.name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-neutral-800' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <Heart className={`w-3 h-3 ${liked ? 'fill-neutral-800' : ''}`} />
              {fmtLikes(likeCount)}
            </button>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Eye className="w-3 h-3" />
              {project.views}
            </span>
          </div>
        </div>

      </div>
    </article>
  )
}
