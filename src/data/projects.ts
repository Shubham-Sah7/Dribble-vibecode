export interface Creator {
  name: string
  username: string
  initials: string
  color: string
  pro: boolean
}

export interface Project {
  id: number
  title: string
  description: string
  category: string
  tags: string[]
  tool: string
  creator: Creator
  likes: number
  views: string
  saves: number
  liveUrl: string
  codeUrl: string
  gradient: string
  accentColor: string
  cardSize: 'normal' | 'tall' | 'square'
  featured?: boolean
  trending?: boolean
}

export const projects: Project[] = [
  {
    id: 1,
    title: "FinanceFlow",
    description: "Ultra-minimal banking dashboard with AI-powered insights, real-time spending analytics, and smart budget forecasting built entirely with voice prompts.",
    category: "Finance",
    tags: ["Banking", "Dashboard", "Analytics"],
    tool: "Lovable",
    creator: { name: "Alex Chen", username: "alexchen", initials: "AC", color: "#10b981", pro: true },
    likes: 1247, views: "8.9k", saves: 342,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-emerald-950 via-emerald-900/70 to-teal-950",
    accentColor: "#10b981",
    cardSize: "square", featured: true, trending: true
  },
  {
    id: 2,
    title: "VibeMind AI",
    description: "Contextual AI assistant that understands your entire workflow and automates repetitive tasks with natural language commands.",
    category: "AI Tools",
    tags: ["AI", "Chat", "Automation"],
    tool: "Cursor",
    creator: { name: "Priya Sharma", username: "priyasharma", initials: "PS", color: "#8b5cf6", pro: true },
    likes: 2103, views: "14.2k", saves: 891,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-violet-950 via-purple-900/70 to-fuchsia-950",
    accentColor: "#8b5cf6",
    cardSize: "normal", trending: true
  },
  {
    id: 3,
    title: "LaunchDeck",
    description: "Build and launch beautiful product landing pages in minutes with AI-generated copy and conversion-optimized layouts.",
    category: "SaaS",
    tags: ["Landing Page", "Marketing", "No-code"],
    tool: "v0",
    creator: { name: "Marcus Williams", username: "marcusw", initials: "MW", color: "#3b82f6", pro: false },
    likes: 876, views: "5.1k", saves: 234,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-blue-950 via-indigo-900/70 to-blue-950",
    accentColor: "#3b82f6",
    cardSize: "normal"
  },
  {
    id: 4,
    title: "CodeCanvas",
    description: "Visual code editor with AI pair programming, real-time collaboration, and one-click deployment to any cloud provider.",
    category: "Dev Tools",
    tags: ["Editor", "Collaboration", "AI"],
    tool: "Bolt",
    creator: { name: "Sarah Kim", username: "sarahkim", initials: "SK", color: "#f59e0b", pro: true },
    likes: 3421, views: "22.1k", saves: 1204,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-zinc-900 via-slate-900/70 to-zinc-950",
    accentColor: "#f59e0b",
    cardSize: "tall", featured: true, trending: true
  },
  {
    id: 5,
    title: "FlowTask",
    description: "AI-powered project management that adapts to your team's rhythm and surfaces bottlenecks before they happen.",
    category: "Productivity",
    tags: ["Kanban", "PM", "Team"],
    tool: "Lovable",
    creator: { name: "James Park", username: "jamespark", initials: "JP", color: "#f97316", pro: false },
    likes: 654, views: "3.8k", saves: 198,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-amber-950 via-orange-900/70 to-amber-950",
    accentColor: "#f97316",
    cardSize: "normal"
  },
  {
    id: 6,
    title: "MedCore",
    description: "Healthcare management for modern clinics with AI-assisted triage, patient scheduling, and diagnosis support.",
    category: "Healthcare",
    tags: ["Health", "Clinic", "AI"],
    tool: "Cursor",
    creator: { name: "Dr. Nina Patel", username: "ninapatel", initials: "NP", color: "#06b6d4", pro: true },
    likes: 1089, views: "7.3k", saves: 445,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-cyan-950 via-sky-900/70 to-cyan-950",
    accentColor: "#06b6d4",
    cardSize: "square"
  },
  {
    id: 7,
    title: "SocialPulse",
    description: "Social media analytics with AI trend detection, content scheduling, and ROI tracking across all platforms.",
    category: "SaaS",
    tags: ["Social", "Analytics", "Marketing"],
    tool: "v0",
    creator: { name: "Zoe Anderson", username: "zoeanderson", initials: "ZA", color: "#ec4899", pro: true },
    likes: 1876, views: "11.4k", saves: 673,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-pink-950 via-rose-900/70 to-pink-950",
    accentColor: "#ec4899",
    cardSize: "normal", trending: true
  },
  {
    id: 8,
    title: "DataStack",
    description: "Modern data warehouse UI with visual query builder, AI-powered insights, and beautiful chart generation.",
    category: "Dev Tools",
    tags: ["Data", "SQL", "Analytics"],
    tool: "Replit",
    creator: { name: "Tom Bradley", username: "tombradley", initials: "TB", color: "#6366f1", pro: false },
    likes: 934, views: "6.2k", saves: 312,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-indigo-950 via-violet-900/70 to-indigo-950",
    accentColor: "#6366f1",
    cardSize: "normal"
  },
  {
    id: 9,
    title: "ShipFast Store",
    description: "Complete e-commerce platform with AI product descriptions, smart inventory, and one-click Stripe integration.",
    category: "SaaS",
    tags: ["E-commerce", "Store", "AI"],
    tool: "Bolt",
    creator: { name: "Elena Cruz", username: "elenacruz", initials: "EC", color: "#ef4444", pro: true },
    likes: 2234, views: "16.8k", saves: 987,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-red-950 via-orange-900/70 to-red-950",
    accentColor: "#ef4444",
    cardSize: "tall", featured: true
  },
  {
    id: 10,
    title: "IndieMaker Hub",
    description: "Portfolio and showcase platform for indie makers to display projects, attract collaborators, and track growth.",
    category: "Design",
    tags: ["Portfolio", "Maker", "Showcase"],
    tool: "Lovable",
    creator: { name: "Kai Nakamura", username: "kainakamura", initials: "KN", color: "#a855f7", pro: true },
    likes: 1456, views: "9.7k", saves: 534,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-fuchsia-950 via-purple-900/70 to-fuchsia-950",
    accentColor: "#a855f7",
    cardSize: "normal", trending: true
  },
  {
    id: 11,
    title: "AIStudio Pro",
    description: "All-in-one AI model playground for fine-tuning, prompt engineering, evaluation, and one-click deployment.",
    category: "AI Tools",
    tags: ["LLM", "Playground", "Fine-tune"],
    tool: "Custom",
    creator: { name: "Ryan Foster", username: "ryanfoster", initials: "RF", color: "#14b8a6", pro: true },
    likes: 4102, views: "28.5k", saves: 1876,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-teal-950 via-emerald-900/70 to-teal-950",
    accentColor: "#14b8a6",
    cardSize: "square", featured: true, trending: true
  },
  {
    id: 12,
    title: "BrandKit AI",
    description: "Generate complete brand identities — logos, color palettes, typography, and full design systems — in seconds.",
    category: "Design",
    tags: ["Branding", "Design System", "Logo"],
    tool: "v0",
    creator: { name: "Mia Thompson", username: "miathompson", initials: "MT", color: "#f43f5e", pro: false },
    likes: 1783, views: "12.1k", saves: 723,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-rose-950 via-pink-900/70 to-fuchsia-950",
    accentColor: "#f43f5e",
    cardSize: "normal"
  },
  {
    id: 13,
    title: "PitchAI",
    description: "Create investor-ready pitch decks in minutes with AI storytelling, competitive analysis, and beautiful templates.",
    category: "Productivity",
    tags: ["Pitch Deck", "Startup", "Presentation"],
    tool: "Cursor",
    creator: { name: "David Lee", username: "davidlee", initials: "DL", color: "#0ea5e9", pro: true },
    likes: 892, views: "4.9k", saves: 267,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-sky-950 via-blue-900/70 to-sky-950",
    accentColor: "#0ea5e9",
    cardSize: "normal"
  },
  {
    id: 14,
    title: "NotionKiller",
    description: "Blazing-fast notes app with AI summarization, bidirectional backlinks, offline sync, and beautiful typography.",
    category: "Productivity",
    tags: ["Notes", "PKM", "Offline"],
    tool: "Replit",
    creator: { name: "Anna Kovacs", username: "annakovacs", initials: "AK", color: "#84cc16", pro: false },
    likes: 1234, views: "8.1k", saves: 456,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-lime-950 via-green-900/70 to-lime-950",
    accentColor: "#84cc16",
    cardSize: "normal"
  },
  {
    id: 15,
    title: "DevOps Flow",
    description: "Visual CI/CD pipeline builder with AI-powered deployment monitoring, anomaly detection, and instant rollbacks.",
    category: "Dev Tools",
    tags: ["DevOps", "CI/CD", "Monitoring"],
    tool: "Vercel",
    creator: { name: "Chris Morgan", username: "chrismorgan", initials: "CM", color: "#f59e0b", pro: true },
    likes: 2567, views: "17.3k", saves: 1102,
    liveUrl: "#", codeUrl: "#",
    gradient: "from-yellow-950 via-amber-900/70 to-yellow-950",
    accentColor: "#f59e0b",
    cardSize: "tall", trending: true
  }
]

export const categories = [
  { label: "All", value: "all" },
  { label: "SaaS", value: "SaaS" },
  { label: "AI Tools", value: "AI Tools" },
  { label: "Mobile Apps", value: "Mobile" },
  { label: "Finance", value: "Finance" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Productivity", value: "Productivity" },
  { label: "Dev Tools", value: "Dev Tools" },
  { label: "Design", value: "Design" },
]

export const filterOptions = [
  { label: "Trending", value: "trending" },
  { label: "Most Liked", value: "most_liked" },
  { label: "Most Viewed", value: "most_viewed" },
  { label: "Newest", value: "newest" },
  { label: "Built with Lovable", value: "Lovable" },
  { label: "Built with Cursor", value: "Cursor" },
  { label: "Built with Bolt", value: "Bolt" },
  { label: "Built with v0", value: "v0" },
  { label: "Built with Replit", value: "Replit" },
]

export const toolColors: Record<string, string> = {
  Lovable: "#ff6b9d",
  Cursor: "#00d4ff",
  Bolt: "#ffd93d",
  v0: "#4f8ef7",
  Replit: "#f26207",
  Vercel: "#e2e8f0",
  Custom: "#a78bfa",
}

export const trendingBuilders = [
  { name: "Sarah Kim", username: "sarahkim", initials: "SK", color: "#f59e0b", projects: 15, likes: 12045, pro: true },
  { name: "Ryan Foster", username: "ryanfoster", initials: "RF", color: "#14b8a6", projects: 6, likes: 9876, pro: true },
  { name: "Alex Chen", username: "alexchen", initials: "AC", color: "#10b981", projects: 12, likes: 8934, pro: true },
  { name: "Zoe Anderson", username: "zoeanderson", initials: "ZA", color: "#ec4899", projects: 10, likes: 7234, pro: false },
  { name: "Priya Sharma", username: "priyasharma", initials: "PS", color: "#8b5cf6", projects: 8, likes: 6721, pro: true },
]

export const topTools = [
  { name: "Lovable", count: "4.2k", color: "#ff6b9d" },
  { name: "Cursor", count: "3.8k", color: "#00d4ff" },
  { name: "Bolt", count: "3.1k", color: "#ffd93d" },
  { name: "v0", count: "2.7k", color: "#4f8ef7" },
  { name: "Replit", count: "2.2k", color: "#f26207" },
  { name: "Vercel", count: "1.9k", color: "#e2e8f0" },
]
