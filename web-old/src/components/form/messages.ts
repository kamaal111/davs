import { defineMessages } from 'react-intl';

const messages = defineMessages({
  defaultFormValidationError: {
    id: 'FORM.DEFAULT_INVALID_FIELD_ERROR',
    defaultMessage: 'Form has been not been filled in correctly',
    description:
      "Default error when we can't decide which error to show to the user",
  },
});

export default messages;
