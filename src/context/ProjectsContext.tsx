import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { projects as staticProjects, type Project } from '@/data/projects'

interface ProjectsContextValue {
  projects: Project[]
  addProject: (project: Project) => void
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

const STORAGE_KEY = 'vibbl_projects_v1'

function loadUserProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [userProjects, setUserProjects] = useState<Project[]>(loadUserProjects)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProjects))
  }, [userProjects])

  const addProject = (project: Project) => {
    setUserProjects(prev => [project, ...prev])
  }

  // User projects appear first, then static demo projects
  const allProjects = [...userProjects, ...staticProjects]

  return (
    <ProjectsContext.Provider value={{ projects: allProjects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider')
  return ctx
}
