import { cookies as nextCookies } from 'next/headers';

const COOKIE_NAMES = {
  DAVS_SESSION: 'davs_session',
} as const;

class Cookies {
  constructor() {}

  setSession = async (token: string): Promise<void> => {
    const cookieStore = await nextCookies();
    const oneDay = 24 * 60 * 60 * 1000;
    cookieStore.set(COOKIE_NAMES.DAVS_SESSION, token, {
      sameSite: 'strict',
      expires: Date.now() + oneDay * 90,
    });
  };

  getSession = async (): Promise<string | null> => {
    const cookieStore = await nextCookies();

    return cookieStore.get(COOKIE_NAMES.DAVS_SESSION)?.value ?? null;
  };
}

const cookies = new Cookies();

export default cookies;
