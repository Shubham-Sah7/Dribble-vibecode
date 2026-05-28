import { filterOptions } from '@/data/projects'

interface FilterBarProps {
  active: string
  onChange: (value: string) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
      {filterOptions.map(filter => {
        const isActive = active === filter.value
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`
              shrink-0 px-3 py-1.5 text-xs rounded transition-all
              ${isActive
                ? 'bg-[#eb3403] text-white font-medium'
                : 'border border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
              }
            `}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
