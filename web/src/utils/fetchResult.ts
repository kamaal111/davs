import { Result, Ok, Err } from '@thames/monads';

import type { Method } from '@/common/http/methods';

async function fetchJSONResult<T extends { details: string }>(
  url: string | URL,
  options?: { method?: Method }
): Promise<Result<T, { details?: string; status: number }>> {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    return Err({ status: 500 });
  }

  const { status } = response;
  let json: T;
  try {
    json = await response.json();
  } catch (error) {
    return Err({ status });
  }

  if (status >= 400) {
    return Err({ details: json.details, status });
  }

  return Ok(json);
}

export default fetchJSONResult;
