import METHODS from '../../../common/http/methods';

class DavsUsersClient {
  private baseURL: URL;
  private apiKey: string;

  constructor({ davsBaseURL, apiKey }: { davsBaseURL: URL; apiKey: string }) {
    this.baseURL = new URL(`${davsBaseURL.toString()}/users`);
    this.apiKey = apiKey;
  }

  session = async ({ jwt }: { jwt: string }) => {
    const url = new URL(`${this.baseURL.toString()}/session`);
    return fetch(url, {
      method: METHODS.GET,
      headers: { authorization: `Bearer ${jwt}` },
    });
  };
}

export default DavsUsersClient;
