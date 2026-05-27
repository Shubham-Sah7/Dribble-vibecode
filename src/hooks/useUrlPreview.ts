import { useState, useEffect, useRef } from 'react'

export interface UrlPreviewData {
  title?: string
  description?: string
  screenshotUrl?: string
  loading: boolean
  error: string | null
}

export function useUrlPreview(url: string): UrlPreviewData {
  const [data, setData] = useState<UrlPreviewData>({ loading: false, error: null })
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (abortRef.current) abortRef.current.abort()

    if (!url || !isValidUrl(url)) {
      setData({ loading: false, error: null })
      return
    }

    setData({ loading: true, error: null })

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
        const res = await fetch(apiUrl, { signal: controller.signal })
        const json = await res.json()

        if (json.status === 'success') {
          setData({
            loading: false,
            error: null,
            title: json.data?.title ?? undefined,
            description: json.data?.description ?? undefined,
            screenshotUrl: json.data?.screenshot?.url ?? undefined,
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

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
