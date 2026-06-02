// Custom error class for API errors with message from backend
export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "APIError";
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}
