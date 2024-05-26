import messages, { type Locale } from '../messages';

const SUPPORTED_LOCALES = Object.keys(messages) as unknown as Locale;

function getSupportedLocales() {
  return SUPPORTED_LOCALES;
}

export default getSupportedLocales;
