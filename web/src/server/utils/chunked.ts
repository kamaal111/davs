function chunked<Element>(array: Array<Element>, chunkSize: number) {
  const arrayLength = array.length;
  if (chunkSize === 0 || arrayLength === 0) return array;
  if (arrayLength < chunkSize) return [array];

  return array.reduce<{
    chunks: Array<Array<Element>>;
    buffer: Array<Element>;
  }>(
    (acc, item, index) => {
      acc.buffer.push(item);
      if (index % chunkSize === chunkSize - 1) {
        acc.chunks.push(acc.buffer);
        acc.buffer = [];
      }
      return acc;
    },
    { chunks: [], buffer: [] }
  ).chunks;
}

export default chunked;
