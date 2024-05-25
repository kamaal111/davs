import {
  type BaseQueryApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import METHODS, { type Method } from '../http/methods';

export type APIError = { details?: string };

type BaseQueryResult<T> =
  | { error: { status: number; data?: APIError }; data: undefined }
  | { data: T; error: undefined };

function baseQuery({ baseUrl }: { baseUrl: string }) {
  const _baseQuery = fetchBaseQuery({ baseUrl });

  return async <Result extends object, Body extends object>(
    args: { url?: string; method?: Method; body?: Body },
    api: BaseQueryApi
  ): Promise<BaseQueryResult<Result>> => {
    let result: Awaited<ReturnType<typeof _baseQuery>>;
    try {
      result = await _baseQuery(
        {
          url: args.url ?? '',
          method: args.method ?? METHODS.GET,
          body: args.body ? JSON.stringify(args.body) : null,
        },
        api,
        {}
      );
    } catch (error) {
      return { error: { status: 500 }, data: undefined };
    }

    const { error, data } = result;
    if (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      return {
        error: { status, data: error.data as APIError },
        data: undefined,
      };
    }

    return { data: data as Result, error: undefined };
  };
}

export default baseQuery;
