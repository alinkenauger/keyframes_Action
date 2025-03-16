import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Add the useMobileView hook for preview toggling
export function useMobileView() {
  const isMobile = useIsMobile()
  const [previewMode, setPreviewMode] = React.useState<'mobile' | 'desktop'>('desktop')

  // Function to toggle between mobile and desktop preview
  const toggleMobilePreview = React.useCallback(() => {
    setPreviewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')
  }, [])

  return {
    isMobile,
    previewMode,
    toggleMobilePreview
  }
}