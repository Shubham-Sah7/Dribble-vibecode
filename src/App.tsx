import { useState, useRef, useMemo } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CategoryBar } from './components/CategoryBar'
import { FilterBar } from './components/FilterBar'
import { ProjectCard } from './components/ProjectCard'
import { Sidebar } from './components/Sidebar'
import { UploadModal } from './components/UploadModal'
import { ProjectDetailModal } from './components/ProjectDetailModal'
import { useProjects } from './context/ProjectsContext'
import { type Project } from './data/projects'

function parseViews(v: string): number {
  if (v.endsWith('k')) return parseFloat(v) * 1000
  return parseFloat(v)
}

function sortProjects(list: Project[], filter: string): Project[] {
  const toolFilters = ['Lovable', 'Cursor', 'Bolt', 'v0', 'Replit', 'Vercel']
  if (toolFilters.includes(filter)) {
    return [...list].sort((a, b) => (a.tool === filter ? -1 : 1) - (b.tool === filter ? -1 : 1))
  }
  switch (filter) {
    case 'trending':    return [...list].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
    case 'most_liked':  return [...list].sort((a, b) => b.likes - a.likes)
    case 'most_viewed': return [...list].sort((a, b) => parseViews(b.views) - parseViews(a.views))
    case 'newest':      return [...list].reverse()
    default:            return list
  }
}

function EmptyState() {
  return (
    <div className="py-24 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded border border-neutral-200 flex items-center justify-center mb-4 text-xl">
        🔭
      </div>
      <h3 className="text-sm font-medium text-neutral-700 mb-1">No projects found</h3>
      <p className="text-xs text-neutral-400">Try a different category or filter</p>
    </div>
  )
}

export default function App() {
  const { projects } = useProjects()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [prefilledUrl, setPrefilledUrl] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter, setActiveFilter] = useState('trending')
  const feedRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const byCategory = activeCategory === 'all'
      ? projects
      : projects.filter(p => p.category === activeCategory)
    return sortProjects(byCategory, activeFilter)
  }, [activeCategory, activeFilter, projects])

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openUpload = (url?: string) => {
    setPrefilledUrl(url ?? '')
    setUploadOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onUploadClick={() => openUpload()} />
      <Hero onExplore={scrollToFeed} onUpload={openUpload} />
      <CategoryBar active={activeCategory} onChange={setActiveCategory} />

      <div ref={feedRef} className="max-w-screen-xl mx-auto px-5 sm:px-8 py-10 flex gap-10 items-start">

        {/* Feed */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                {activeCategory === 'all' ? 'All Projects' : activeCategory}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">{filtered.length} projects</p>
            </div>
          </div>

          <FilterBar active={activeFilter} onChange={setActiveFilter} />

          <div className="mt-6">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="columns-1 sm:columns-2 xl:columns-3 gap-5">
                {filtered.map(project => (
                  <div key={project.id} className="break-inside-avoid mb-5">
                    <ProjectCard
                      project={project}
                      onClick={() => setSelectedProject(project)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-56 xl:w-60 shrink-0 sticky top-28">
          <Sidebar />
        </aside>

      </div>

      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        prefilledUrl={prefilledUrl}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
