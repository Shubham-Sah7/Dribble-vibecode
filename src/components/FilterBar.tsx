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
              shrink-0 px-3 py-1.5 text-[12px] font-medium rounded-full transition-all
              ${isActive
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
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
