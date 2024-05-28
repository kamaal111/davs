class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, options: { cause?: Error }) {
    super(message, { cause: options?.cause });
    this.statusCode = statusCode;
  }
}

export default APIError;
