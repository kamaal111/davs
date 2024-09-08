import APIError from './api-error';

async function apiErrorHandler(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    if (!(error instanceof APIError)) {
      return Response.json(
        { details: 'Something went wrong' },
        { status: 500 }
      );
    }

    return Response.json(
      { details: error.message },
      { status: error.statusCode }
    );
  }
}

export default apiErrorHandler;
