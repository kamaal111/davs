import type { Response, NextFunction } from 'express';

import type { AppRequest } from '../types';
import CookiesParser from '../utils/cookies-parser';
import davsClient from '../clients/davs-client';

const LOGIN_PATH = '/login';
const AUTHORIZATION_PATHS = [LOGIN_PATH, '/signup'];

function authorization() {
  return async (
    request: AppRequest,
    response: Response,
    next: NextFunction
  ) => {
    const accept = request.headers.accept;
    if (!accept) {
      response.status(400);
      next('router');
    }

    if (!accept!.includes('text/html')) {
      next('route');
      return;
    }

    for (const authorizationPath of AUTHORIZATION_PATHS) {
      if (request.path.startsWith(authorizationPath)) {
        next('route');
        return;
      }
    }

    const cookies = new CookiesParser(request);
    const sessionToken = cookies.get('davs_session');
    if (sessionToken == null) {
      response.redirect(LOGIN_PATH);
      return;
    }

    const sessionResponse = await davsClient.users.session({
      jwt: sessionToken,
    });
    if (!sessionResponse.ok) {
      response.redirect(LOGIN_PATH);
      return;
    }

    next('route');
  };
}

export default authorization;
