import type { NextRequest } from 'next/server';

export function POST(request: NextRequest) {
  return Response.json({ details: 'hello' });
}
