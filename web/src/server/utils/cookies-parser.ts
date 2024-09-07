import { chunked } from '@kamaalio/kamaal/arrays/chunked';

import type { AppRequest } from '../types';

class CookiesParser {
  request: AppRequest;

  constructor(request: AppRequest) {
    this.request = request;
  }

  object = (): Record<string, string> => {
    const cookies = this.request.header('cookie');
    if (cookies == null) return {};

    return Object.fromEntries(chunked(cookies.split('='), 2));
  };

  get = (key: string): string | null => {
    return this.object()[key] ?? null;
  };
}

export default CookiesParser;
