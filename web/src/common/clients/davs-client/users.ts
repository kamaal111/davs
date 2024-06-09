'use server';

import type { z } from 'zod';

import type SignUpPayload from '@/users/validators/sign-up-payload';
import encryption from '@/encryption/encryption';
import METHODS, { type Method } from '@/common/http/methods';
import type LoginPayload from '@/users/validators/login-payload';

class DavsUsersClient {
  private baseURL: URL;
  private apiKey: string;

  constructor({ davsBaseURL, apiKey }: { davsBaseURL: URL; apiKey: string }) {
    this.baseURL = new URL(`${davsBaseURL.toString()}/users`);
    this.apiKey = apiKey;
  }

  signUp = async (body: z.infer<typeof SignUpPayload>) => {
    return this.encryptedCall({
      body,
      path: 'sign-up',
      method: METHODS.POST,
    });
  };

  login = async (body: z.infer<typeof LoginPayload>) => {
    return this.encryptedCall({
      body,
      path: 'login',
      method: METHODS.POST,
    });
  };

  private encryptedCall = async <Body extends Record<string, unknown>>({
    body,
    path,
    method,
  }: {
    body: Body;
    path: string;
    method: Method;
  }) => {
    const encryptedBody = encryption.aes.encryptObject(body);
    const url = new URL(`${this.baseURL.toString()}/${path}`);
    return fetch(url, {
      method,
      body: JSON.stringify({ message: encryptedBody }),
      headers: { authorization: `Token ${this.apiKey}` },
    });
  };
}

export default DavsUsersClient;
