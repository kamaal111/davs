import path from 'node:path';
import express from 'express';
import ViteExpress from 'vite-express';
import logger from 'morgan';
import cors from 'cors';

import type { AppRequest, AppRouter } from './types';
import settings from './settings';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Things messed up, sorry!';
const STATUS_CODE_TO_MESSAGE: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  500: INTERNAL_SERVER_ERROR_MESSAGE,
};

class App {
  private app: express.Express;

  constructor({ routers }: { routers: AppRouter[] }) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes(routers);
  }

  listen = () => {
    const port = settings.PORT;
    ViteExpress.listen(this.app, port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  };

  private initializeMiddleware = () => {
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(cors());
  };

  private initializeRoutes = (routers: AppRouter[]) => {
    for (const router of routers) {
      this.app.use(path.join('/api/v1', router.path), router.router);
    }

    this.app.use(this.errorHandler);
  };

  private errorHandler = (
    _request: AppRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = response.statusCode;
    if (statusCode === 404 || (statusCode >= 200 && statusCode < 300)) {
      next();
      return;
    }

    response.status(statusCode).json({
      details:
        STATUS_CODE_TO_MESSAGE[statusCode] ?? INTERNAL_SERVER_ERROR_MESSAGE,
    });
  };
}

export default App;
