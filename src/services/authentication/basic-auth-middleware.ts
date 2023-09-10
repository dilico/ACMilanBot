import type { Request, Response, NextFunction } from 'express';

const unauthorized = (res: Response) => {
  res.setHeader('WWW-Authenticate', 'Basic');
  return res.sendStatus(401);
};

export const basicAuthentication = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return unauthorized(res);
  }
  const auth = Buffer.from(header.split(' ')[1], 'base64')
    .toString()
    .split(':');
  const [user, password] = auth;
  if (user !== process.env.AUTH_USER || password !== process.env.AUTH_PASSWORD) {
    return unauthorized(res);
  }
  next();
};
