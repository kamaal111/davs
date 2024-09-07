import { type Locale } from '../messages';
import { type Messages } from '../types';
import getFlattenedMessages from './get-flattened-messages';

function getMessages(locale: Locale): Messages {
  const flattenedMessages = getFlattenedMessages();

  return flattenedMessages[locale];
}

export default getMessages;
