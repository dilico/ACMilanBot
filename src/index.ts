import moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@milanbot': `${__dirname}`,
});

import dotenv from 'dotenv';
import express from 'express';
import 'module-alias/register';
import {
  basicAuthentication,
  pingRequestHandler,
  scheduleRequestHandler,
  preMatchRequestHandler,
  errorHandler,
} from '@milanbot/routing';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(basicAuthentication);
app.use(express.json());
app.get('/ping', pingRequestHandler);
app.post('/schedule', scheduleRequestHandler);
app.post('/pre-match', preMatchRequestHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`ACMilanBot listening on port ${PORT}`);
});
