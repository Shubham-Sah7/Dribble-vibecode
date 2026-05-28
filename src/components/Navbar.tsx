import { useState } from 'react'
import { Search, X, Menu } from 'lucide-react'

interface NavbarProps {
  onUploadClick: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

function PGLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Product Gallery">
      <rect width="28" height="28" rx="4" fill="#0f0f0f" />
      <text
        x="14" y="19.5"
        textAnchor="middle"
        fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#eb3403"
        letterSpacing="-0.5"
      >PG</text>
    </svg>
  )
}

export function Navbar({ onUploadClick, searchQuery, onSearchChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 h-[58px] flex items-center gap-6">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
          <PGLogo />
          <span className="font-semibold text-[14px] text-neutral-900 tracking-tight hidden sm:block">
            Product Gallery
          </span>
        </a>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-[340px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search products, makers, tools…"
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-9 py-1.5 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 focus:bg-white transition-all"
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
        <div className="hidden md:flex items-center gap-1">
          {['Explore', 'Makers', 'Trending'].map(item => (
            <a
              key={item}
              href="#"
              className="px-3 py-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-50 transition-all"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onUploadClick}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold bg-[#eb3403] text-white hover:bg-[#c42d02] transition-colors rounded-lg"
          >
            Submit
          </button>

          <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer hover:bg-neutral-600 transition-colors select-none">
            VS
          </div>

          <button
            className="md:hidden w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-4 space-y-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-neutral-400 transition-all"
            />
          </div>
          {['Explore', 'Makers', 'Trending'].map(item => (
            <a key={item} href="#" className="block px-2 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              {item}
            </a>
          ))}
          <div className="pt-2 border-t border-neutral-100 mt-2">
            <button
              onClick={() => { onUploadClick(); setMobileOpen(false) }}
              className="w-full py-2.5 text-sm font-semibold bg-[#eb3403] text-white hover:bg-[#c42d02] rounded-lg transition-colors"
            >
              Submit a Project
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
