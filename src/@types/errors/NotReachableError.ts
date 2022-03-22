import { BaseError } from "./BaseError";

export class NotReachableError extends Error implements BaseError {
  public statusCode: number;
  public name: string;

  constructor(url: string) {
    super(`Can't find ${url} on this server!`);

    this.statusCode = 404;
    this.name = "NotReachable";
  }
}