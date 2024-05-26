import { Glob } from 'bun';

import { extract } from '@formatjs/cli-lib';
import unflatten from '@kamaalio/kamaal/objects/unflatten';
import { run as jscodeshift } from 'jscodeshift/src/Runner';

type MessageDescriptor = { defaultMessage: string };
type ExtractedMessages = Record<string, MessageDescriptor>;

async function main() {
  const messagesFiles = await getMessagesFiles();
  const messages = await extractDefaultMessages(messagesFiles);
  makeConstants(messages.flatMessages);

  await Bun.write(
    'src/translations/messages/en.json',
    appendNewLineToString(JSON.stringify(messages.unflattenMessages, null, 2))
  );
}

function makeConstants(messages: Record<string, string>) {
  console.log('messages', messages);
  console.log('jscodeshift', jscodeshift);
}

function appendNewLineToString(value: string) {
  return `${value}\n`;
}

async function extractDefaultMessages(messagesFiles: string[]) {
  const extractedMessagesJSON = await extract(messagesFiles, {});
  const extractedMessages: ExtractedMessages = JSON.parse(
    extractedMessagesJSON
  );
  const messagesWithJustDefaults =
    reformatMessagesWithJustDefaults(extractedMessages);
  const unflattenMessages = unflatten(messagesWithJustDefaults, '.');

  return { flatMessages: messagesWithJustDefaults, unflattenMessages };
}

function reformatMessagesWithJustDefaults(
  messages: ExtractedMessages
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [key, value.defaultMessage])
  );
}

async function getMessagesFiles() {
  const glob = new Glob('src/**/messages.ts');
  const filepaths: string[] = [];
  for await (const filepath of glob.scan('.')) {
    filepaths.push(filepath);
  }

  return filepaths;
}

main();
