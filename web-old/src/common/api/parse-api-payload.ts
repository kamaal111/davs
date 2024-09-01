import type { NextRequest } from 'next/server';
import type { z } from 'zod';

import InvalidJSONError from '../errors/invalid-json-error';

async function parseAPIPayload<Schema extends z.ZodTypeAny>(
  request: NextRequest,
  schema: Schema
): Promise<z.infer<Schema>> {
  let body: Awaited<ReturnType<typeof request.json>>;
  try {
    body = await request.json();
  } catch (error) {
    throw new InvalidJSONError(request, { cause: error as Error });
  }

  try {
    return schema.parse(body);
  } catch (error) {
    throw new InvalidJSONError(request, { cause: error as Error });
  }
}

export default parseAPIPayload;
