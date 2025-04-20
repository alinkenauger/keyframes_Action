import { useEffect } from 'react';

/**
 * Component that adds CSS variables for safe area insets on iOS
 */
export function SafeAreaProvider() {
  useEffect(() => {
    // Add safe area inset variables to :root
    function setSafeAreaVariables() {
      // Only proceed if we're in a browser environment
      if (typeof window === 'undefined' || !document.documentElement) return;

      // Set default values (fallback)
      document.documentElement.style.setProperty('--sat', '0px');
      document.documentElement.style.setProperty('--sar', '0px');
      document.documentElement.style.setProperty('--sab', '0px');
      document.documentElement.style.setProperty('--sal', '0px');

      // Check if env() is supported
      try {
        // Test with a harmless CSS env() call
        const testEl = document.createElement('div');
        testEl.style.paddingTop = 'env(safe-area-inset-top, 0px)';
        
        if (getComputedStyle(testEl).paddingTop === '0px') {
          // env() is supported, set the CSS variables
          document.documentElement.style.setProperty(
            '--sat', 
            'env(safe-area-inset-top, 0px)'
          );
          document.documentElement.style.setProperty(
            '--sar', 
            'env(safe-area-inset-right, 0px)'
          );
          document.documentElement.style.setProperty(
            '--sab', 
            'env(safe-area-inset-bottom, 0px)'
          );
          document.documentElement.style.setProperty(
            '--sal', 
            'env(safe-area-inset-left, 0px)'
          );
        }
      } catch (e) {
        console.error('Error setting safe area variables:', e);
      }
    }

    // Set variables on mount
    setSafeAreaVariables();

    // Update on resize and orientation change
    window.addEventListener('resize', setSafeAreaVariables);
    window.addEventListener('orientationchange', setSafeAreaVariables);
    
    return () => {
      window.removeEventListener('resize', setSafeAreaVariables);
      window.removeEventListener('orientationchange', setSafeAreaVariables);
    };
  }, []);

  return null;
}