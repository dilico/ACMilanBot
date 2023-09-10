import type { RequestHandler } from 'express';

export const pingRequestHandler = (async (req, res, next) => {
  console.log('Received ping request');
  res.status(200).send('pong');
}) as RequestHandler;
