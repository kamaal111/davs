import { getLocaleForDevice } from '../utils/get-locale';
import getMessages from '../utils/get-messages';

function useMessages() {
  const locale = getLocaleForDevice();
  const messages = getMessages(locale);

  return { locale, messages };
}

export default useMessages;
