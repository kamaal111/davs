import { Glob } from 'bun';
import path from 'node:path';
import fs from 'node:fs/promises';

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
    ].map(({ destination, data }) => Bun.write(destination, data))
  );

  let error: Error | undefined;
  try {
    await makeConstants();
  } catch (e) {
    error = e as Error;
  }

  const generatedFile = Bun.file(GENERATED_CONSTANTS_FILE_PATH);
  if (error == null || error instanceof TimeoutError) {
    await Bun.write('src/translations/messages/constants.ts', generatedFile);
  }

  if (error != null) {
    await fs.unlink(GENERATED_CONSTANTS_FILE_PATH);
    throw error;
  }
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
  const glob = new Glob('src/**/messages.ts');
  const filepaths: string[] = [];
  for await (const filepath of glob.scan('.')) {
    filepaths.push(filepath);
  }

  return filepaths;
}

main();
