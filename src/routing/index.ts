import type { ErrorRequestHandler, RequestHandler } from 'express';

export { scheduleRequestHandler } from '@milanbot/routing/schedule-handler';
export { preMatchRequestHandler } from '@milanbot/routing/pre-match-handler';

export const errorHandler = ((error, req, res, next) => {
  res.status(400);
  res.json({
    message: error.message
  });
}) as ErrorRequestHandler;
