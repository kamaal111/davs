const METHODS = { POST: 'POST', GET: 'GET' } as const;

export type Method = keyof typeof METHODS;

export default METHODS;
