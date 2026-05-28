import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface NavbarProps {
  onUploadClick: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

function PGLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Product Gallery">
      <rect width="28" height="28" fill="#0a0a0a" />
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
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-neutral-900">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 h-14 flex items-center gap-5">

        {/* Logo + Wordmark */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <PGLogo />
          <span className="font-black text-[13px] text-neutral-900 tracking-tight hidden sm:block uppercase">
            Product Gallery
          </span>
        </a>

        {/* Divider */}
        <div className="hidden md:block h-4 w-px bg-neutral-300 shrink-0" />

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search products, makers, tools…"
            className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-400 rounded-none px-9 py-1.5 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
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
          {['Explore', 'Makers', 'Trending'].map(item => (
            <a
              key={item}
              href="#"
              className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 hover:text-neutral-900 uppercase tracking-widest transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onUploadClick}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-[#eb3403] text-white hover:bg-[#c42d02] active:bg-[#a82602] transition-colors rounded-none"
          >
            Submit
          </button>

          <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-black text-white cursor-pointer hover:bg-neutral-700 transition-colors select-none">
            VS
          </div>

          <button
            className="md:hidden w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-900 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="text-base font-black leading-none">{mobileOpen ? '×' : '≡'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-neutral-900 bg-white px-5 py-4 space-y-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-none pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 transition-all"
            />
          </div>
          {['Explore', 'Makers', 'Trending'].map(item => (
            <a key={item} href="#" className="flex items-center px-1 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border-b border-neutral-100 transition-colors">
              {item}
            </a>
          ))}
          <div className="pt-3">
            <button
              onClick={() => { onUploadClick(); setMobileOpen(false) }}
              className="w-full py-3 text-[10px] font-black uppercase tracking-widest bg-[#eb3403] text-white hover:bg-[#c42d02] transition-colors rounded-none"
            >
              Submit a Project
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
