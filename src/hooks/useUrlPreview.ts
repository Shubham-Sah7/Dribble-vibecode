import { useState, useEffect, useRef } from 'react'

export interface UrlPreviewData {
  title?: string
  description?: string
  screenshotUrl?: string
  ogImageUrl?: string
  loading: boolean
  error: string | null
}

/**
 * Normalize a raw URL string.
 * Handles: bare domains (myapp.vercel.app), //domain, http://, https://
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  // Anything with a dot is likely a domain — prepend https://
  if (trimmed.includes('.')) return `https://${trimmed}`
  return trimmed
}

function isUsableUrl(str: string): boolean {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function useUrlPreview(url: string): UrlPreviewData {
  const [data, setData] = useState<UrlPreviewData>({ loading: false, error: null })
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (abortRef.current) abortRef.current.abort()

    // The hook already receives a normalized URL from UploadModal
    if (!url || !isUsableUrl(url)) {
      setData({ loading: false, error: null })
      return
    }

    setData({ loading: true, error: null })

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        // Fetch screenshot + OG/meta data together (no meta=false → we get image/logo too)
        const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true`
        const res = await fetch(apiUrl, { signal: controller.signal })
        const json = await res.json()

        if (json.status === 'success') {
          const d = json.data ?? {}
          setData({
            loading: false,
            error: null,
            title: d.title ?? undefined,
            description: d.description ?? undefined,
            screenshotUrl: d.screenshot?.url ?? undefined,
            // OG / social image as a fallback thumbnail
            ogImageUrl: d.image?.url ?? d.logo?.url ?? undefined,
          })
        } else {
          setData({ loading: false, error: 'Could not generate preview' })
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setData({ loading: false, error: 'Preview unavailable' })
        }
      }
    }, 800)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [url])

  return data
}
