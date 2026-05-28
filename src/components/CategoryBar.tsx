import { motion } from 'framer-motion'
import { categories } from '@/data/projects'

interface CategoryBarProps {
  active: string
  onChange: (value: string) => void
}

export function CategoryBar({ active, onChange }: CategoryBarProps) {
  return (
    <div className="sticky top-14 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="flex items-center no-scrollbar overflow-x-auto">
          {categories.map(cat => {
            const isActive = active === cat.value
            return (
              <motion.button
                key={cat.value}
                onClick={() => onChange(cat.value)}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative shrink-0 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap
                  ${isActive ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}
                `}
              >
                {cat.label}
                {isActive && (
                  <motion.div
                    layoutId="categoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#eb3403]"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
