type LogArgs = unknown[]

export const logger = {
  info: (...args: LogArgs) => {
    console.log(new Date().toISOString(), '|', ...args)
    // You could also write to a file or send to a logging service here
  },
  error: (...args: LogArgs) => {
    console.error(new Date().toISOString(), '|', ...args)
  }
} 