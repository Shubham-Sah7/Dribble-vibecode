import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { categories } from '@/data/projects'

interface CategoryBarProps {
  active: string
  onChange: (value: string) => void
}

export function CategoryBar({ active, onChange }: CategoryBarProps) {
  return (
    <div className="sticky top-[58px] z-40 bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 h-[89px] flex items-center gap-4 lg:gap-6">

        {/* Left: Discover button */}
        <button className="hidden lg:flex shrink-0 items-center gap-1.5 px-3.5 py-[9px] rounded-lg bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-700 transition-colors">
          Discover
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>

        {/* Center: Scrollable category tabs */}
        <div className="flex-1 flex items-center gap-[7px] overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const isActive = active === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => onChange(cat.value)}
                className={`
                  shrink-0 h-[41px] px-[14px] text-[13px] rounded-md transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-[#f3f3f4] text-neutral-900 font-semibold'
                    : 'text-neutral-500 font-medium hover:text-neutral-800 hover:bg-neutral-50'
                  }
                `}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Right: Filters button */}
        <button className="hidden sm:flex shrink-0 items-center gap-1.5 px-3.5 py-[9px] rounded-lg border border-neutral-200 text-neutral-600 text-[13px] font-medium hover:border-neutral-300 hover:text-neutral-900 hover:bg-neutral-50 transition-all">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>

      </div>
    </div>
  )
}
