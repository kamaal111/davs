import type { MESSAGES_KEYS } from './messages/constants';

export type MessageKeys = (typeof MESSAGES_KEYS)[keyof typeof MESSAGES_KEYS];

export type Messages = Record<MessageKeys, string>;
