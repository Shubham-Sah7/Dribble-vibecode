import { filterOptions } from '@/data/projects'

interface FilterBarProps {
  active: string
  onChange: (value: string) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
      {filterOptions.map(filter => {
        const isActive = active === filter.value
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`
              shrink-0 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-none
              ${isActive
                ? 'bg-neutral-900 text-white border border-neutral-900'
                : 'border border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900'
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
