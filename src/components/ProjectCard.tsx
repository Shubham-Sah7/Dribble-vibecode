import { useState } from 'react'
import { Heart, Eye, Bookmark, ExternalLink, Code2, Expand } from 'lucide-react'
import { type Project } from '@/data/projects'

function Thumbnail({ project, onClick }: { project: Project; onClick?: () => void }) {
  const aspectClass =
    project.cardSize === 'square' ? 'aspect-square' :
    project.cardSize === 'tall'   ? 'aspect-[4/3]'  :
    'aspect-video'

  if (project.screenshotUrl) {
    return (
      <div className={`relative overflow-hidden ${aspectClass} bg-neutral-100 cursor-pointer`} onClick={onClick}>
        <img
          src={project.screenshotUrl}
          alt={project.title}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${aspectClass} bg-neutral-100`}>
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Subtle color tint */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: project.accentColor, opacity: 0.05 }}
      />

      {/* Browser chrome */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-white border-b border-neutral-200/80 flex items-center px-3 gap-2 z-10">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        </div>
        <div className="flex-1 h-3 bg-neutral-100 rounded-sm" />
      </div>

      {/* UI skeleton */}
      <div className="absolute top-7 left-0 right-0 bottom-0 p-3 flex flex-col gap-2">
        <div className="h-2.5 bg-neutral-200 rounded-sm w-1/2" />
        <div className="h-1.5 bg-neutral-200/70 rounded-sm w-full" />
        <div className="h-1.5 bg-neutral-200/50 rounded-sm w-4/5" />
        <div className="flex-1" />
        <div className="flex gap-1.5">
          <div
            className="h-6 w-16 rounded-sm"
            style={{ backgroundColor: project.accentColor, opacity: 0.18 }}
          />
          <div className="h-6 flex-1 bg-neutral-200/50 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes)

  const fmtLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#'
  const hasCodeUrl = project.codeUrl && project.codeUrl !== '#'

  return (
    <div className="group bg-white border border-neutral-200 rounded-lg overflow-hidden card-lift">

      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <Thumbnail project={project} onClick={onClick} />

        {/* Bookmark */}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-2 right-2 z-20 w-6 h-6 rounded bg-white border border-neutral-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-50"
          aria-label="Save"
        >
          <Bookmark className={`w-3 h-3 ${saved ? 'fill-neutral-700 text-neutral-700' : 'text-neutral-400'}`} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/92 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 z-10">
          {onClick && (
            <button
              onClick={onClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-700 transition-colors rounded"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors rounded"
            >
              <ExternalLink className="w-3 h-3" />
              Open Live
            </a>
          )}
          {!onClick && hasLiveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-700 transition-colors rounded"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors rounded"
            >
              <Code2 className="w-3 h-3" />
              View Code
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Title + tool */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className={`text-sm font-semibold text-neutral-900 leading-snug ${onClick ? 'cursor-pointer hover:text-neutral-600 transition-colors' : ''}`}
            onClick={onClick}
          >
            {project.title}
          </h3>
          <span className="shrink-0 text-[10px] text-neutral-400 font-medium mt-0.5">{project.tool}</span>
        </div>

        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
          {project.description}
        </p>

        {/* Tags — max 2 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-500 border border-neutral-200"
            >
              {tag}
            </span>
          ))}
        </div>

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
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-neutral-700' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <Heart className={`w-3 h-3 ${liked ? 'fill-neutral-700' : ''}`} />
              {fmtLikes(likeCount)}
            </button>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Eye className="w-3 h-3" />
              {project.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
