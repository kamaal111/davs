const METHODS = { POST: 'POST' } as const;

export type Method = keyof typeof METHODS;

export default METHODS;
