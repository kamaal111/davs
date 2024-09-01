import en from './en.json';
import nl from './nl.json';

export type Locale = 'en' | 'nl';
export type NestedMessages = typeof en;

const messages: Record<Locale, NestedMessages> = { en, nl };

export default messages;
