import { trendingBuilders, topTools, projects } from '@/data/projects'

function SectionHeading({ title }: { title: string }) {
  return (
    <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">
      {title}
    </h3>
  )
}

export function Sidebar() {
  const featured = projects.find(p => p.featured && p.trending)
  const topByLikes = [...projects].sort((a, b) => b.likes - a.likes).slice(0, 5)

  return (
    <div className="space-y-8">

      {/* Trending Builders */}
      <div>
        <SectionHeading title="Trending Builders" />
        <div className="space-y-3.5">
          {trendingBuilders.map((builder, i) => (
            <div key={builder.username} className="flex items-center gap-3 group cursor-pointer">
              <span className="text-xs text-neutral-300 w-4 shrink-0 tabular-nums">{i + 1}</span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                style={{ backgroundColor: builder.color }}
              >
                {builder.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-neutral-700 truncate group-hover:text-neutral-900 transition-colors">
                  {builder.name}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {builder.projects} projects
                </div>
              </div>
              <span className="text-xs text-neutral-400 tabular-nums">
                {(builder.likes / 1000).toFixed(1)}k
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Top AI Tools */}
      <div>
        <SectionHeading title="Top Tools" />
        <div className="space-y-2.5">
          {topTools.map((tool, i) => (
            <div key={tool.name} className="flex items-center gap-3">
              <span className="text-xs text-neutral-700 w-14 shrink-0">{tool.name}</span>
              <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-300 rounded-full"
                  style={{ width: `${Math.max(20, 100 - i * 13)}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-400 w-8 text-right tabular-nums">{tool.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Leaderboard */}
      <div>
        <SectionHeading title="This Week" />
        <div className="space-y-3">
          {topByLikes.map((project, i) => (
            <div key={project.id} className="flex items-center gap-2.5 group cursor-pointer">
              <span className="text-xs text-neutral-300 w-4 shrink-0 tabular-nums">{i + 1}</span>
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ backgroundColor: project.accentColor, opacity: 0.75 }}
              >
                {project.title[0]}
              </div>
              <span className="text-xs text-neutral-600 flex-1 truncate group-hover:text-neutral-900 transition-colors">
                {project.title}
              </span>
              <span className="text-[10px] text-neutral-400 tabular-nums">
                {(project.likes / 1000).toFixed(1)}k
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Featured */}
      {featured && (
        <div>
          <SectionHeading title="Featured" />
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            {/* Thumbnail strip */}
            <div className="h-20 bg-neutral-100 dot-grid relative">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundColor: featured.accentColor }}
              />
            </div>
            <div className="p-3">
              <div className="text-xs font-semibold text-neutral-900 mb-1">{featured.title}</div>
              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-2.5">
                {featured.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ backgroundColor: featured.creator.color }}
                  >
                    {featured.creator.initials}
                  </div>
                  <span className="text-[10px] text-neutral-500">{featured.creator.name}</span>
                </div>
                <button className="text-[10px] text-neutral-500 hover:text-neutral-900 transition-colors">
                  View →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
