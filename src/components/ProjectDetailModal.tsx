import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Code2, Heart, Eye, Loader2 } from 'lucide-react'
import { type Project } from '@/data/projects'

interface ProjectDetailModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  // Reset iframe status whenever the project changes so we get a fresh load spinner
  useEffect(() => {
    setIframeStatus('loading')
  }, [project?.id])

  if (!project) return null

  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#'

  const handleIframeLoad = () => setIframeStatus('loaded')
  const handleIframeError = () => setIframeStatus('error')

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-5xl h-[85vh] bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ backgroundColor: project.creator.color }}
              >
                {project.creator.initials}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 truncate">{project.title}</h2>
                <p className="text-xs text-neutral-400">{project.creator.name} · {project.tool}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasLiveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#eb3403] text-white hover:bg-[#c42d02] transition-colors rounded"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open Live
                </a>
              )}
              {project.codeUrl && project.codeUrl !== '#' && (
                <a
                  href={project.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors rounded"
                >
                  <Code2 className="w-3 h-3" />
                  Code
                </a>
              )}
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 relative bg-neutral-50 overflow-hidden">
            {!hasLiveUrl ? (
              <ScreenshotFallback project={project} />
            ) : (
              <>
                {/* Loading state */}
                {iframeStatus === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 z-10">
                    <div className="text-center">
                      <Loader2 className="w-5 h-5 text-neutral-400 animate-spin mx-auto mb-2" />
                      <p className="text-xs text-neutral-400">Loading preview…</p>
                    </div>
                  </div>
                )}

                {/* Error state — show screenshot if available, else a clean prompt */}
                {iframeStatus === 'error' && (
                  project.screenshotUrl ? (
                    /* Screenshot fills the preview area seamlessly */
                    <div className="absolute inset-0">
                      <img
                        src={project.screenshotUrl}
                        alt={project.title}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Subtle overlay with "Open" CTA */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-8">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors rounded shadow-lg"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl">🔗</div>
                      <p className="text-sm font-medium text-neutral-700">{project.title}</p>
                      <p className="text-xs text-neutral-400 max-w-xs">
                        This site doesn't allow embedding — open it directly to view.
                      </p>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#eb3403] text-white hover:bg-[#c42d02] transition-colors rounded"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open in new tab
                      </a>
                    </div>
                  )
                )}

                {/* Iframe */}
                <iframe
                  key={project.liveUrl}
                  src={project.liveUrl}
                  title={project.title}
                  className={`w-full h-full border-0 ${iframeStatus === 'error' ? 'hidden' : ''}`}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between shrink-0">
            <p className="text-xs text-neutral-500 line-clamp-1 max-w-xl">{project.description}</p>
            <div className="flex items-center gap-3 shrink-0 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {project.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {project.views}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function ScreenshotFallback({ project }: { project: Project }) {
  if (project.screenshotUrl) {
    return (
      <img
        src={project.screenshotUrl}
        alt={project.title}
        className="w-full h-full object-cover object-top"
      />
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 dot-grid flex items-center justify-center text-2xl">
        🔭
      </div>
      <p className="text-sm font-medium text-neutral-700">{project.title}</p>
      <p className="text-xs text-neutral-400 max-w-xs">{project.description}</p>
    </div>
  )
}
