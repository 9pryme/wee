import { trackEvent, EventCategory, EventAction } from './analytics'

export const triggerTestEvents = async () => {
  const events = [
    {
      action: EventAction.LONG_TASK,
      category: EventCategory.PERFORMANCE,
      label: 'Test long task',
      value: 150
    },
    {
      action: EventAction.SLOW_RENDER,
      category: EventCategory.PERFORMANCE,
      label: 'Test slow render',
      value: 60
    },
    {
      action: EventAction.JS_ERROR,
      category: EventCategory.ERROR,
      label: 'Test error event'
    },
    {
      action: EventAction.PAGE_FROZEN,
      category: EventCategory.PERFORMANCE,
      label: 'Test page freeze',
      value: 3500
    }
  ]

  // Trigger events with a small delay between each
  for (const event of events) {
    trackEvent(event)
    console.log(`📊 Triggered event: ${event.category} - ${event.action}`)
    // Add small delay between events
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Force a JS error for testing
  setTimeout(() => {
    try {
      // @ts-expect-error Intentionally calling undefined function for error testing
      nonExistentFunction()
    } catch (error: unknown) {
      if (error instanceof Error) {
        trackEvent({
          action: EventAction.JS_ERROR,
          category: EventCategory.ERROR,
          label: error.message
        })
      }
      console.log('🐛 Triggered test JS error')
    }
  }, 1000)

  // Simulate a network error
  setTimeout(() => {
    trackEvent({
      action: EventAction.NETWORK_ERROR,
      category: EventCategory.ERROR,
      label: 'Failed to load resource: the server responded with a status of 404'
    })
    console.log('🌐 Triggered test network error')
  }, 1500)

  return true
} 