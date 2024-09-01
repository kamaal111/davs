import type { AppRequest } from '../types';
import chunked from './chunked';

class CookiesParser {
  request: AppRequest;

  constructor(request: AppRequest) {
    this.request = request;
  }

  object = (): Record<string, string> => {
    const cookies = this.request.header('cookie');
    if (cookies == null) return {};

    const chunkedCookies = chunked(cookies.split('='), 2) as Array<
      [key: string, value?: string]
    >;

    return Object.fromEntries(chunkedCookies);
  };

  get = (key: string): string | null => {
    return this.object()[key] ?? null;
  };
}

export default CookiesParser;
