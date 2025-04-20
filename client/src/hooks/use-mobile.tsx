import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check for mobile devices
    const mobileCheck = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))
    }

    const checkDeviceType = () => {
      // First check for touch device via user agent (more reliable for phones)
      const isTouchDevice = mobileCheck() || 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // Then use screen width to determine size category
      const width = window.innerWidth
      const isMobileSize = width < MOBILE_BREAKPOINT
      const isTabletSize = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT

      // Set mobile if device is actually mobile or screen is mobile-sized
      setIsMobile(isTouchDevice || isMobileSize)
      
      // Set tablet if screen is tablet-sized (and not already detected as mobile)
      setIsTablet(isTabletSize && !isTouchDevice)
    }

    // Run check immediately
    checkDeviceType()

    // Set up listeners
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const tabletMql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      checkDeviceType()
    }

    mql.addEventListener("change", onChange)
    tabletMql.addEventListener("change", onChange)
    
    window.addEventListener('resize', onChange)
    
    return () => {
      mql.removeEventListener("change", onChange)
      tabletMql.removeEventListener("change", onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [])

  return { isMobile: !!isMobile, isTablet: !!isTablet }
}

// Add the useMobileView hook for preview toggling
export function useMobileView() {
  const { isMobile, isTablet } = useIsMobile()
  const [previewMode, setPreviewMode] = React.useState<'mobile' | 'desktop' | 'tablet'>('desktop')
  const [step, setStep] = React.useState<number>(1)
  const [mobileView, setMobileView] = React.useState<'sidebar' | 'workspace'>('sidebar')

  // Function to toggle between mobile and desktop preview
  const toggleMobilePreview = React.useCallback(() => {
    setPreviewMode(prev => {
      if (prev === 'desktop') return 'mobile'
      if (prev === 'mobile') return 'tablet'
      return 'desktop'
    })
  }, [])

  // Function to toggle between sidebar and workspace view on mobile
  const toggleMobileView = React.useCallback(() => {
    setMobileView(prev => prev === 'sidebar' ? 'workspace' : 'sidebar')
  }, [])

  // Function to navigate through steps on mobile
  const goToStep = React.useCallback((newStep: number) => {
    setStep(newStep)
    // Auto switch views based on step
    if (newStep <= 3) {
      setMobileView('sidebar')
    } else {
      setMobileView('workspace')
    }
  }, [])

  const nextStep = React.useCallback(() => {
    setStep(prev => Math.min(prev + 1, 5))
    // Auto switch views based on step
    if (step >= 3) {
      setMobileView('workspace')
    }
  }, [step])

  const prevStep = React.useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1))
    // Auto switch views based on step
    if (step <= 4) {
      setMobileView('sidebar')
    }
  }, [step])

  return {
    isMobile,
    isTablet,
    previewMode,
    toggleMobilePreview,
    mobileView,
    toggleMobileView,
    step,
    goToStep,
    nextStep,
    prevStep
  }
}