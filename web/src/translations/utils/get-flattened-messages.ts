import flatten from '@kamaalio/kamaal/objects/flatten';

import messages, { type Locale } from '../messages';
import { type Messages } from '../types';
import toEntries from '@/common/objects/to-entries';

const flattenedMessages = toEntries(messages).reduce(
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
