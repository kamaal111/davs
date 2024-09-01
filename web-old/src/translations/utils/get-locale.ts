import { type NextRequest } from 'next/server';

import { DEFAULT_LANGUAGE } from '../constants';
import { type Locale } from '../messages';
import getSupportedLocales from './get-supported-locales';

function getLocale(language: string): Locale {
  const supportedLocales = getSupportedLocales();
  if (!supportedLocales.includes(language)) return DEFAULT_LANGUAGE;

  return language as Locale;
}

export function getLocaleForDevice(): Locale {
  const deviceLanguage = navigator.language?.slice(0, 2) ?? DEFAULT_LANGUAGE;

  return getLocale(deviceLanguage);
}

export function getLocaleForAPI(headers: NextRequest['headers']): Locale {
  const acceptLanguage =
    headers.get('accept-language')?.slice(0, 2) ?? DEFAULT_LANGUAGE;

  return getLocale(acceptLanguage);
}

export default getLocale;
