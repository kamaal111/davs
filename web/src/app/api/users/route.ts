import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  let body: Awaited<ReturnType<typeof request.json>>;
  try {
    body = await request.json();
  } catch (error) {
    return Response.json({ details: 'Failed to create user' }, { status: 400 });
  }

  return Response.json({ details: 'hello' });
}
