'use server';

import loadRequiredEnv from '@/common/env/load-required-env';
import DavsUsersClient from './users';

const { DAVS_API_KEY, DAVS_SERVER_BASE_URL } = loadRequiredEnv([
  'DAVS_API_KEY',
  'DAVS_SERVER_BASE_URL',
]);

class DavsClient {
  users: DavsUsersClient;

  constructor() {
    const baseURL = new URL(`${DAVS_SERVER_BASE_URL}/api/v1`);
    this.users = new DavsUsersClient({
      davsBaseURL: baseURL,
      apiKey: DAVS_API_KEY,
    });
  }
}

const davsClient = new DavsClient();

export default davsClient;
