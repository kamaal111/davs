import { type Locale } from '../messages';
import getFlattenedMessages from './get-flattened-messages';

type Messages = Record<string, string>;

function getMessages(locale: Locale): Messages {
  const flattenedMessages = getFlattenedMessages();

  return flattenedMessages[locale];
}

export default getMessages;
