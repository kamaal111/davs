import { type NextRequest } from 'next/server';

import { getLocaleForAPI } from './get-locale';
import getMessages from './get-messages';
import { type MessageKeys } from '../types';

function getAPIMessage(headers: NextRequest['headers'], id: MessageKeys) {
  const locale = getLocaleForAPI(headers);
  const messages = getMessages(locale);

  return messages[id];
}

export default getAPIMessage;
