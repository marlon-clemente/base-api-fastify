export class HandleError extends Error {
  public statusCode: number
  public message: string
  public customCode?: string
  public details?: any

  constructor(message: string, statusCode: number, details?: any, customCode?: string) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.customCode = customCode
    this.message = message
    this.details = details

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HandleError)
    }
  }
}
