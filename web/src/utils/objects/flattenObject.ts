function flattenObject<Result extends object>(
  obj: Record<string, unknown>,
  parentKey = '',
  result = {} as Result
): Result {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof value !== 'object' || Array.isArray(value)) {
      return { ...acc, [newKey]: value };
    }

    return flattenObject(value as Record<string, unknown>, newKey, acc);
  }, result);
}

export default flattenObject;
