import { trendingBuilders, topTools, projects } from '@/data/projects'

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-[3px] h-3.5 bg-[#eb3403] shrink-0" />
      <h3 className="text-[8.5px] font-black text-neutral-400 uppercase tracking-[0.22em]">
        {title}
      </h3>
    </div>
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
        <div className="space-y-4">
          {trendingBuilders.map((builder, i) => (
            <div key={builder.username} className="flex items-center gap-3 group cursor-pointer">
              <span className="text-[9px] font-black text-neutral-300 w-4 shrink-0 tabular-nums">{i + 1}</span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: builder.color }}
              >
                {builder.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-neutral-700 truncate group-hover:text-neutral-900 transition-colors">
                  {builder.name}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {builder.projects} projects
                </div>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 tabular-nums">
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
        <div className="space-y-3">
          {topTools.map((tool, i) => (
            <div key={tool.name} className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-neutral-700 w-16 shrink-0">{tool.name}</span>
              <div className="flex-1 h-[3px] bg-neutral-100 overflow-hidden rounded-none">
                <div
                  className="h-full bg-neutral-900"
                  style={{ width: `${Math.max(20, 100 - i * 13)}%`, transition: 'width 0.6s ease' }}
                />
              </div>
              <span className="text-[9px] font-black text-neutral-400 w-8 text-right tabular-nums">{tool.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Weekly leaderboard */}
      <div>
        <SectionHeading title="This Week" />
        <div className="space-y-3">
          {topByLikes.map((project, i) => (
            <div key={project.id} className="flex items-center gap-2.5 group cursor-pointer">
              <span className="text-[9px] font-black text-neutral-300 w-4 shrink-0 tabular-nums">{i + 1}</span>
              <div
                className="w-6 h-6 flex items-center justify-center text-[9px] font-black text-white shrink-0"
                style={{ backgroundColor: project.accentColor }}
              >
                {project.title[0]}
              </div>
              <span className="text-[12px] font-medium text-neutral-600 flex-1 truncate group-hover:text-neutral-900 transition-colors">
                {project.title}
              </span>
              <span className="text-[9px] font-black text-neutral-400 tabular-nums shrink-0">
                {(project.likes / 1000).toFixed(1)}k
              </span>
            </div>
          ))}
        </div>
      </div>

      {featured && (
        <>
          <div className="h-px bg-neutral-100" />
          <div>
            <SectionHeading title="Spotlight" />
            <div className="border border-neutral-200 hover:border-neutral-900 transition-colors overflow-hidden rounded-none cursor-pointer">
              {/* Thumbnail strip */}
              <div className="h-24 bg-neutral-100 dot-grid relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundColor: featured.accentColor }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black text-neutral-200">{featured.title[0]}</span>
                </div>
              </div>
              <div className="p-3 border-t border-neutral-200">
                <div className="text-[12px] font-bold text-neutral-900 mb-1 tracking-tight">{featured.title}</div>
                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-3">
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
                    <span className="text-[10px] text-neutral-500 font-medium">{featured.creator.name}</span>
                  </div>
                  <button className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">
                    View →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
