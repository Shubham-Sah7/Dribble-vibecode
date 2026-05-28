import { useState, useRef, useMemo } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { FeaturedSection } from './components/FeaturedSection'
import { CategoryBar } from './components/CategoryBar'
import { FilterBar } from './components/FilterBar'
import { ProjectCard } from './components/ProjectCard'
import { Sidebar } from './components/Sidebar'
import { UploadModal } from './components/UploadModal'
import { ProjectDetailModal } from './components/ProjectDetailModal'
import { useProjects } from './context/ProjectsContext'
import { type Project } from './data/projects'
import { Search } from 'lucide-react'

function parseViews(v: string): number {
  if (v.endsWith('k')) return parseFloat(v) * 1000
  return parseFloat(v)
}

const TOOL_FILTERS = ['Lovable', 'Cursor', 'Bolt', 'v0', 'Replit', 'Vercel', 'Claude', 'Windsurf', 'Framer']

function sortProjects(list: Project[], filter: string): Project[] {
  if (TOOL_FILTERS.includes(filter)) {
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

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="py-28 flex flex-col items-center text-center">
      <div className="w-16 h-16 border-2 border-neutral-200 flex items-center justify-center mb-5">
        {searchQuery
          ? <Search className="w-5 h-5 text-neutral-300" />
          : <span className="text-2xl">🔭</span>}
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-widest text-neutral-700 mb-2">
        {searchQuery ? `No results for "${searchQuery}"` : 'Nothing here yet'}
      </h3>
      <p className="text-xs text-neutral-400">
        {searchQuery
          ? 'Try different keywords or browse all categories'
          : 'Try a different category or filter'}
      </p>
    </div>
  )
}

export default function App() {
  const { projects } = useProjects()
  const [uploadOpen,      setUploadOpen     ] = useState(false)
  const [prefilledUrl,    setPrefilledUrl   ] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeCategory,  setActiveCategory ] = useState('all')
  const [activeFilter,    setActiveFilter   ] = useState('trending')
  const [searchQuery,     setSearchQuery    ] = useState('')
  const feedRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    let list = projects
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.creator.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.tool.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    return sortProjects(list, activeFilter)
  }, [projects, searchQuery, activeCategory, activeFilter])

  const scrollToFeed = () =>
    feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const openUpload = (url?: string) => {
    setPrefilledUrl(url ?? '')
    setUploadOpen(true)
  }

  const handleSearchChange = (q: string) => {
    setSearchQuery(q)
    if (q && activeCategory !== 'all') setActiveCategory('all')
  }

  const isHomepage = !searchQuery && activeCategory === 'all'

  return (
    <div className="min-h-screen bg-white">

      <Navbar
        onUploadClick={() => openUpload()}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Hero + Featured — only on homepage */}
      {isHomepage && (
        <>
          <Hero onExplore={scrollToFeed} onUpload={openUpload} />
          <FeaturedSection
            projects={projects}
            onProjectClick={setSelectedProject}
          />
        </>
      )}

      {/* Category sticky bar */}
      <CategoryBar
        active={activeCategory}
        onChange={cat => { setActiveCategory(cat); setSearchQuery('') }}
      />

      {/* Main content */}
      <div ref={feedRef} className="max-w-[1440px] mx-auto px-5 sm:px-8 py-10 flex gap-10 items-start">

        {/* Feed */}
        <main className="flex-1 min-w-0">

          {/* Feed header */}
          <div className="flex items-start justify-between mb-6 pb-5 border-b-2 border-neutral-900">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">
                {searchQuery
                  ? 'Search results'
                  : activeCategory === 'all' ? 'Browse' : activeCategory}
              </p>
              <h2 className="text-xl font-black tracking-tight text-neutral-900 leading-none">
                {filtered.length}{' '}
                <span className="text-neutral-400 font-normal text-base">
                  {filtered.length === 1 ? 'product' : 'products'}
                  {searchQuery && (
                    <span className="ml-1">
                      for "<span className="text-neutral-600">{searchQuery}</span>"
                    </span>
                  )}
                </span>
              </h2>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[9px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-900 px-3 py-2 transition-all rounded-none mt-1"
              >
                Clear ×
              </button>
            )}
          </div>

          {/* Filter pills — only when not searching */}
          {!searchQuery && (
            <FilterBar active={activeFilter} onChange={setActiveFilter} />
          )}

          {/* Grid */}
          <div className={!searchQuery ? 'mt-6' : 'mt-0'}>
            {filtered.length === 0 ? (
              <EmptyState searchQuery={searchQuery} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-60 xl:w-64 shrink-0 sticky top-28">
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
