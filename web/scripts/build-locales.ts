import { Glob } from 'bun';

import { extract } from '@formatjs/cli-lib';
import unflatten from '@kamaalio/kamaal/objects/unflatten';

async function main() {
  const messagesFiles = await getMessagesFiles();
  const unflattenMessages = await extractDefaultMessages(messagesFiles);
  console.log('unflattenMessages', unflattenMessages);
}

async function extractDefaultMessages(messagesFiles: string[]) {
  const extractedMessagesJSON = await extract(messagesFiles, {});
  const extractedMessages = JSON.parse(extractedMessagesJSON);
  const unflattenMessages = unflatten(extractedMessages, '.');

  return unflattenMessages;
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
