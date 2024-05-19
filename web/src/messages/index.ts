import en from './en';
import nl from './nl';

import flattenObject from '@/utils/objects/flattenObject';

type Locale = 'en' | 'nl';
type NestedMessages = typeof en;

const messages: Record<Locale, NestedMessages> = { en, nl };

type Messages = Record<string, string>;

const flattenedMessages = Object.entries(messages).reduce(
  (allMessages, [locale, nestedMessages]) => ({
    ...allMessages,
    [locale]: flattenObject(nestedMessages),
  }),
  {} as Record<Locale, Messages>
);

const SUPPORTED_LOCALES = Object.keys(messages) as unknown as Locale;

export const DEFAULT_LANGUAGE: Locale = 'en';

export function getLocale(): Locale {
  const deviceLanguage = navigator.language?.slice(0, 2);
  if (deviceLanguage == null) return DEFAULT_LANGUAGE;
  if (!SUPPORTED_LOCALES.includes(deviceLanguage)) return DEFAULT_LANGUAGE;
  return deviceLanguage as Locale;
}

export function getMessages(): Messages {
  const locale = getLocale();
  return flattenedMessages[locale];
}
