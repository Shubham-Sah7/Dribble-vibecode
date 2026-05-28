import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'

interface NavbarProps {
  onUploadClick: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function Navbar({ onUploadClick, searchQuery, onSearchChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 h-14 flex items-center gap-5">

        {/* Logo */}
        <a href="#" className="shrink-0 text-neutral-900 font-bold text-lg tracking-tight hover:opacity-70 transition-opacity">
          Vibbl
        </a>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search products, makers, tools…"
            className="w-full bg-neutral-50 border border-neutral-200 rounded-md pl-9 pr-3 py-1.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center">
          {['Explore', 'Makers', 'Leaderboard'].map(item => (
            <a
              key={item}
              href="#"
              className="px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onUploadClick}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-700 transition-colors rounded-md"
          >
            Submit
          </button>

          <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-[11px] font-semibold text-neutral-600 cursor-pointer hover:bg-neutral-300 transition-colors select-none">
            VS
          </div>

          <button
            className="md:hidden w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-5 py-4 space-y-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search products, makers, tools…"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-neutral-400 transition-all"
            />
          </div>
          {['Explore', 'Makers', 'Leaderboard'].map(item => (
            <a key={item} href="#" className="block px-2 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              {item}
            </a>
          ))}
          <div className="pt-2 border-t border-neutral-100 mt-2">
            <button
              onClick={() => { onUploadClick(); setMobileOpen(false) }}
              className="w-full py-2 text-sm font-medium bg-neutral-900 text-white rounded-md transition-colors"
            >
              Submit a Project
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
