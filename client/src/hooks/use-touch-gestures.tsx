import { useState, useEffect, useRef, RefObject } from 'react';

export interface TouchGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
}

export type TouchAction = 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch' | 'none';

interface TouchState {
  startX: number;
  startY: number;
  startDistance: number;
  currentX: number;
  currentY: number;
  currentDistance: number;
  action: TouchAction;
}

const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe to be detected
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity for a swipe to be detected

export function useTouchGestures(
  ref: RefObject<HTMLElement>,
  handlers: TouchGestureHandlers = {}
) {
  const [touchAction, setTouchAction] = useState<TouchAction>('none');
  const [scale, setScale] = useState(1);
  
  // Track touch state to calculate gestures
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startDistance: 0,
    currentX: 0,
    currentY: 0,
    currentDistance: 0,
    action: 'none'
  });
  
  // Track timing for velocity calculation
  const touchStartTime = useRef<number>(0);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const getDistance = (touches: TouchList): number => {
      if (touches.length < 2) return 0;
      
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    const getCenterPoint = (touches: TouchList): { x: number; y: number } => {
      if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
      
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
      };
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      const touches = e.touches;
      
      if (touches.length === 1) {
        // Single touch - potential swipe
        touchState.current = {
          ...touchState.current,
          startX: touches[0].clientX,
          startY: touches[0].clientY,
          currentX: touches[0].clientX,
          currentY: touches[0].clientY,
          action: 'none'
        };
      } else if (touches.length === 2) {
        // Two touches - potential pinch
        const distance = getDistance(touches);
        const center = getCenterPoint(touches);
        
        touchState.current = {
          ...touchState.current,
          startX: center.x,
          startY: center.y,
          currentX: center.x,
          currentY: center.y,
          startDistance: distance,
          currentDistance: distance,
          action: 'pinch'
        };
      }
      
      touchStartTime.current = Date.now();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default to avoid scroll/zoom conflicts
      // But only if we've detected a gesture
      if (touchState.current.action !== 'none') {
        e.preventDefault();
      }
      
      const touches = e.touches;
      
      if (touches.length === 1) {
        // Update current position for swipe detection
        touchState.current.currentX = touches[0].clientX;
        touchState.current.currentY = touches[0].clientY;
        
        // Detect horizontal or vertical swipe based on movement
        const deltaX = touchState.current.currentX - touchState.current.startX;
        const deltaY = touchState.current.currentY - touchState.current.startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          // Horizontal swipe
          touchState.current.action = deltaX > 0 ? 'swipe-right' : 'swipe-left';
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
          // Vertical swipe
          touchState.current.action = deltaY > 0 ? 'swipe-down' : 'swipe-up';
        }
      } else if (touches.length === 2) {
        // Update for pinch
        const distance = getDistance(touches);
        touchState.current.currentDistance = distance;
        
        // Calculate and set scale based on distance change
        if (touchState.current.startDistance > 0) {
          const newScale = distance / touchState.current.startDistance;
          setScale(newScale);
          
          if (handlers.onPinch) {
            handlers.onPinch(newScale);
          }
        }
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const action = touchState.current.action;
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime.current;
      
      if (action === 'none') return;
      
      if (action.startsWith('swipe')) {
        const deltaX = touchState.current.currentX - touchState.current.startX;
        const deltaY = touchState.current.currentY - touchState.current.startY;
        const velocityX = Math.abs(deltaX) / touchDuration;
        const velocityY = Math.abs(deltaY) / touchDuration;
        
        // Trigger swipe handlers based on direction and thresholds
        if (action === 'swipe-left' && 
            Math.abs(deltaX) > SWIPE_THRESHOLD && 
            velocityX > SWIPE_VELOCITY_THRESHOLD &&
            handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        } else if (action === 'swipe-right' && 
                   Math.abs(deltaX) > SWIPE_THRESHOLD && 
                   velocityX > SWIPE_VELOCITY_THRESHOLD &&
                   handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (action === 'swipe-up' && 
                   Math.abs(deltaY) > SWIPE_THRESHOLD && 
                   velocityY > SWIPE_VELOCITY_THRESHOLD &&
                   handlers.onSwipeUp) {
          handlers.onSwipeUp();
        } else if (action === 'swipe-down' && 
                   Math.abs(deltaY) > SWIPE_THRESHOLD && 
                   velocityY > SWIPE_VELOCITY_THRESHOLD &&
                   handlers.onSwipeDown) {
          handlers.onSwipeDown();
        }
      }
      
      // Reset touch state
      setTouchAction(action); // Set the last action for external usage
      touchState.current.action = 'none';
      
      // Reset scale if needed, or keep last scale
      if (action === 'pinch') {
        // Here you could reset scale or keep it, depending on UX needs
        // setScale(1);
      }
    };
    
    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, handlers]);
  
  return { touchAction, scale };
}
