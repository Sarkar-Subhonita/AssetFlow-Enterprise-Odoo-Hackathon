// Custom error class so controllers/services can throw errors that
// carry an HTTP status code. Caught centrally by error.middleware.ts.
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
