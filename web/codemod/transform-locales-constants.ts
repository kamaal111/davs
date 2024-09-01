import {
  API,
  Collection,
  FileInfo,
  JSCodeshift,
  VariableDeclarator,
} from 'jscodeshift';

function transform(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const source = j(fileInfo.source);
  const messages = getMessages(source);
  const messagesKeys = getMessagesKeys(j, messages);
  const transformedKeys = transformMessagesKeys(messagesKeys);
  const exportedMessagesKeysConstant = makeExportedMessagesKeysConstant(
    j,
    transformedKeys
  );

  return `${[exportedMessagesKeysConstant].join('\n\n')}\n`;
}

function makeExportedMessagesKeysConstant(
  j: JSCodeshift,
  transformedKeys: Record<string, string>
) {
  const properties = Object.entries(transformedKeys).map(([key, value]) => {
    return j.property('init', j.identifier(key), j.literal(value));
  });
  const declaration = j.variableDeclaration('const', [
    j.variableDeclarator(
      j.identifier('MESSAGES_KEYS'),
      j.objectExpression(properties)
    ),
  ]);
  const exportedDeclaration = j.exportDeclaration(false, declaration);
  let exportedDeclarationsSource = j(exportedDeclaration).toSource();
  if (exportedDeclarationsSource.at(-1) === ';') {
    exportedDeclarationsSource = exportedDeclarationsSource.slice(
      0,
      exportedDeclarationsSource.length - 1
    );
  }

  return `${exportedDeclarationsSource} as const`;
}

function transformMessagesKeys(keys: string[]) {
  return Object.fromEntries(keys.map(key => [key.replace(/./g, '_'), key]));
}

function getMessagesKeys(
  j: JSCodeshift,
  messages: Collection<VariableDeclarator>
) {
  return messages
    .find(j.Property)
    .nodes()
    .map(property => {
      const { key } = property;
      if (!j.Literal.check(key)) {
        throw new Error('Invalid messages property key');
      }
      if (typeof key.value !== 'string') {
        throw new Error('Invalid messages property key type');
      }

      return key.value;
    });
}

function getMessages(source: Collection) {
  return source.findVariableDeclarators('messages');
}

export default transform;
