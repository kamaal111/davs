import type { z } from 'zod';

import type SignUpPayload from '@/users/validators/sign-up-payload';
import METHODS from '@/common/http/methods';
import type LoginPayload from '@/users/validators/login-payload';

class DavsUsersClient {
  private baseURL: URL;
  private apiKey: string;

  constructor({ davsBaseURL, apiKey }: { davsBaseURL: URL; apiKey: string }) {
    this.baseURL = new URL(`${davsBaseURL.toString()}/users`);
    this.apiKey = apiKey;
  }

  signUp = async (body: z.infer<typeof SignUpPayload>) => {
    const url = new URL(`${this.baseURL.toString()}/sign-up`);

    return fetch(url, {
      method: METHODS.POST,
      body: JSON.stringify(body),
      headers: this.defaultHeaders,
    });
  };

  login = async (body: z.infer<typeof LoginPayload>) => {
    const url = new URL(`${this.baseURL.toString()}/login`);

    return fetch(url, {
      method: METHODS.POST,
      body: JSON.stringify(body),
      headers: this.defaultHeaders,
    });
  };

  session = async ({ jwt }: { jwt: string }) => {
    const url = new URL(`${this.baseURL.toString()}/session`);

    return fetch(url, {
      method: METHODS.GET,
      headers: { ...this.defaultHeaders, authorization: `Bearer ${jwt}` },
    });
  };

  private get defaultHeaders() {
    return {
      authorization: `Token ${this.apiKey}`,
      'content-type': 'application/json',
    };
  }
}

export default DavsUsersClient;
