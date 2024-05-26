import { type NextRequest } from 'next/server';

import { type MessageDescriptor } from 'react-intl';
import { getLocaleForAPI } from './get-locale';

function getAPIMessage(
  headers: NextRequest['headers'],
  descriptor: MessageDescriptor['id']
) {
  const locale = getLocaleForAPI(headers);
  //   const intl = getImperativeIntl()[locale];

  console.log('🐸🐸🐸 descriptor', descriptor);
  //   return intl.formatMessage(descriptor);
  return 'yes';
}

export default getAPIMessage;
