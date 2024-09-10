type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

function toEntries<Target extends object>(
  object: Target
): Array<Entry<Target>> {
  return Object.entries(object) as Array<Entry<Target>>;
}

export default toEntries;
