export interface BaseError extends Error {
    name: string;
    statusCode: number;
    code?: number;
    path?: string;
    value?: string;
    errmsg?: string;
  }