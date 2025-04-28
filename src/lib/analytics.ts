// Add debug mode check
const isDev = process.env.NODE_ENV === 'development'

// Log the pageview with their URL
export const pageview = (url: string) => {
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: url,
        debug_mode: isDev
      })
      
      if (isDev) {
        console.log('📄 GA Pageview sent:', {
          url,
          measurementId: process.env.NEXT_PUBLIC_GA_ID
        })
      }
    } catch (error) {
      if (isDev) {
        console.error('❌ Failed to send GA pageview:', error)
      }
    }
  } else if (isDev) {
    console.warn('⚠️ gtag not available')
  }
}

// Log specific events happening
export const event = ({ 
  action, 
  params 
}: { 
  action: string; 
  params: Record<string, string | number | boolean | undefined>
}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params)
  }
}

// Extend the Window interface to include gtag with proper typing
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string,
      params?: Record<string, unknown>
    ) => void
  }
}

// Enhanced event tracking with categories
export const trackEvent = ({ 
  action, 
  category, 
  label, 
  value 
}: { 
  action: string; 
  category: string; 
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag === 'function') {
    try {
      // Format event name for GA4 (no spaces, lowercase)
      const eventName = `${category}_${action}`.toLowerCase().replace(/\s+/g, '_');
      
      window.gtag('event', eventName, {
        // GA4 parameters
        event_category: category,
        event_label: label,
        value: value,
        // Additional parameters for debugging
        debug_mode: isDev,
        send_to: process.env.NEXT_PUBLIC_GA_ID
      })
      
      if (isDev) {
        console.log('🔍 GA4 Event sent:', {
          event_name: eventName,
          params: {
            event_category: category,
            event_label: label,
            value: value
          },
          measurementId: process.env.NEXT_PUBLIC_GA_ID
        })
      }
    } catch (error) {
      if (isDev) {
        console.error('❌ Failed to send GA event:', error)
      }
    }
  } else if (isDev) {
    console.warn('⚠️ gtag not available')
  }
}

// Predefined event categories
export const EventCategory = {
  PETITION: 'petition',
  VIDEO: 'video',
  ENGAGEMENT: 'engagement',
  PERFORMANCE: 'performance',
  ERROR: 'error'
} as const

// Predefined event actions
export const EventAction = {
  // Petition events
  SIGN_UP_INITIATED: 'form_start',
  PETITION_SIGNED: 'form_submit',
  CTA_CLICK: 'button_click',
  SHARE_CLICKED: 'share',
  
  // Video events
  VIDEO_PLAYED: 'video_start',
  VIDEO_PAUSED: 'video_pause',
  VIDEO_COMPLETED: 'video_complete',
  VIDEO_PROGRESS: 'video_progress',
  
  // Performance events
  PAGE_UNRESPONSIVE: 'page_unresponsive',
  LONG_TASK: 'long_task',
  PAGE_FROZEN: 'page_frozen',
  SLOW_RENDER: 'slow_render',
  
  // Error events
  JS_ERROR: 'exception',
  NETWORK_ERROR: 'network_error'
} as const

// Create a performance monitoring utility
export const monitorPerformance = () => {
  if (typeof window === 'undefined') return

  // Monitor long tasks
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // Report tasks that take more than 100ms
      if (entry.duration > 100) {
        trackEvent({
          action: EventAction.LONG_TASK,
          category: EventCategory.PERFORMANCE,
          label: isDev ? 'Long task detected' : undefined,
          value: Math.round(entry.duration)
        })
      }
    })
  })

  observer.observe({ entryTypes: ['longtask'] })

  // Monitor page freezes
  let lastActivityTime = Date.now()
  let freezeTimeout: NodeJS.Timeout

  const resetTimer = () => {
    lastActivityTime = Date.now()
    clearTimeout(freezeTimeout)
    
    freezeTimeout = setTimeout(() => {
      const inactiveDuration = Date.now() - lastActivityTime
      if (inactiveDuration > 3000) { // 3 seconds threshold
        trackEvent({
          action: EventAction.PAGE_FROZEN,
          category: EventCategory.PERFORMANCE,
          label: isDev ? 'Page freeze detected' : undefined,
          value: Math.round(inactiveDuration)
        })
      }
    }, 3000)
  }

  // Monitor user interactions
  ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    window.addEventListener(event, resetTimer, { passive: true })
  })

  // Monitor network errors
  window.addEventListener('error', (event) => {
    if (event.message.includes('loading chunk') || event.message.includes('Loading CSS chunk')) {
      trackEvent({
        action: EventAction.NETWORK_ERROR,
        category: EventCategory.ERROR,
        label: event.message
      })
    }
  })

  // Monitor JavaScript errors
  window.onerror = (msg, url, lineNo, columnNo) => {
    trackEvent({
      action: EventAction.JS_ERROR,
      category: EventCategory.ERROR,
      label: `${msg} (${url}:${lineNo}:${columnNo})`
    })
    return false
  }

  // Monitor slow renders using requestAnimationFrame
  let lastFrameTime = performance.now()
  
  const checkFrameTime = () => {
    const currentTime = performance.now()
    const frameDuration = currentTime - lastFrameTime
    
    if (frameDuration > 50) { // More than 3 frames (50ms) indicates jank
      trackEvent({
        action: EventAction.SLOW_RENDER,
        category: EventCategory.PERFORMANCE,
        label: 'Slow render detected',
        value: Math.round(frameDuration)
      })
    }
    
    lastFrameTime = currentTime
    requestAnimationFrame(checkFrameTime)
  }
  
  requestAnimationFrame(checkFrameTime)
} 