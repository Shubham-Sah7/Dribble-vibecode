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
    <div className="py-24 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-lg border border-neutral-200 flex items-center justify-center mb-4">
        {searchQuery
          ? <Search className="w-4.5 h-4.5 text-neutral-300" />
          : <span className="text-xl">🔭</span>}
      </div>
      <h3 className="text-sm font-semibold text-neutral-700 mb-1">
        {searchQuery ? `No results for "${searchQuery}"` : 'No products found'}
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

      {/* Hero + Featured — only on homepage, not during search */}
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
      <div ref={feedRef} className="max-w-screen-xl mx-auto px-5 sm:px-8 py-10 flex gap-10 items-start">

        {/* Feed */}
        <main className="flex-1 min-w-0">

          {/* Feed header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[13px] font-semibold text-neutral-900">
                {searchQuery
                  ? 'Search results'
                  : activeCategory === 'all' ? 'All Products' : activeCategory}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
                {searchQuery && (
                  <span className="ml-1">
                    for "<span className="text-neutral-600">{searchQuery}</span>"
                  </span>
                )}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded px-3 py-1.5 hover:border-neutral-300 transition-colors"
              >
                Clear search
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
