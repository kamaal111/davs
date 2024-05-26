import flatten from '@kamaalio/kamaal/objects/flatten';

import messages, { Locale } from '../messages';
import { type Messages } from '../types';

const flattenedMessages = Object.entries(messages).reduce(
  (allMessages, [locale, nestedMessages]) => ({
    ...allMessages,
    [locale]: flatten(nestedMessages),
  }),
  {} as Record<Locale, Messages>
);

function getFlattenedMessages() {
  return flattenedMessages;
}

export default getFlattenedMessages;
