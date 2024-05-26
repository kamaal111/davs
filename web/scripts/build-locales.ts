import path from 'node:path';
import fs from 'node:fs/promises';

import fg from 'fast-glob';
import { extract } from '@formatjs/cli-lib';
import unflatten from '@kamaalio/kamaal/objects/unflatten';
import { run as jscodeshift } from 'jscodeshift/src/Runner';

type MessageDescriptor = { defaultMessage: string };
type ExtractedMessages = Record<string, MessageDescriptor>;

const GENERATED_CONSTANTS_FILE_PATH =
  'scripts/build-locales-generated-constants.ts';

const CODEMOD_TIMEOUT_IN_MILLISECONDS = 1500;

class TimeoutError extends Error {
  constructor(millis: number) {
    super(`Timed out after ${millis} ms.`);
  }
}

async function main() {
  const messagesFiles = await getMessagesFiles();
  const messages = await extractDefaultMessages(messagesFiles);

  await Promise.all(
    [
      {
        destination: GENERATED_CONSTANTS_FILE_PATH,
        data: `const messages = ${JSON.stringify(messages.flatMessages, null, 2)}`,
      },
      {
        destination: 'src/translations/messages/en.json',
        data: appendNewLineToString(
          JSON.stringify(messages.unflattenMessages, null, 2)
        ),
      },
    ].map(({ destination, data }) => fs.writeFile(destination, data))
  );

  let error: Error | undefined;
  try {
    await makeConstants();
  } catch (e) {
    error = e as Error;
  }

  if (error == null || error instanceof TimeoutError) {
    const generatedFile = await fs.readFile(GENERATED_CONSTANTS_FILE_PATH);
    await fs.writeFile('src/translations/messages/constants.ts', generatedFile);
  }

  await fs.unlink(GENERATED_CONSTANTS_FILE_PATH);
  if (error != null) throw error;
}

async function makeConstants() {
  return await withTimeout(
    CODEMOD_TIMEOUT_IN_MILLISECONDS,
    jscodeshift(
      path.resolve('codemod/transform-locales-constants.ts'),
      [path.resolve(GENERATED_CONSTANTS_FILE_PATH)],
      {
        dry: false,
        verbose: 1,
        print: true,
        parser: 'typescript',
      }
    )
  );
}

async function withTimeout<Result>(
  millis: number,
  promise: Promise<Result>
): Promise<Result> {
  let timeoutPid: Timer;
  const timeout = new Promise(
    (_resolve, reject) =>
      (timeoutPid = setTimeout(() => reject(new TimeoutError(millis)), millis))
  );
  return (Promise.race([promise, timeout]) as Promise<Result>).finally(() => {
    if (timeoutPid) {
      clearTimeout(timeoutPid);
    }
  });
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
  return fg.glob(['src/**/messages.ts']);
}

main();
