import { Glob } from 'bun';

import { extract } from '@formatjs/cli-lib';
import unflatten from '@kamaalio/kamaal/objects/unflatten';

type MessageDescriptor = { defaultMessage: string };
type ExtractedMessages = Record<string, MessageDescriptor>;

async function main() {
  const messagesFiles = await getMessagesFiles();
  const unflattenMessages = await extractDefaultMessages(messagesFiles);

  await Bun.write(
    'src/messages/en.json',
    JSON.stringify(unflattenMessages, null, 2)
  );
}

async function extractDefaultMessages(messagesFiles: string[]) {
  const extractedMessagesJSON = await extract(messagesFiles, {});
  const extractedMessages: ExtractedMessages = JSON.parse(
    extractedMessagesJSON
  );
  const messagesWithJustDefaults =
    reformatMessagesWithJustDefaults(extractedMessages);
  const unflattenMessages = unflatten(messagesWithJustDefaults, '.');

  return unflattenMessages;
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
