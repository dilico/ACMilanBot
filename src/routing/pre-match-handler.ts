import type { RequestHandler } from 'express';
import { createMatchCronJob, deletePreMatchCronJob } from '@milanbot/scheduler';
import Fixture from '@milanbot/services/fixtures/fixture';
import PreMatch from '@milanbot//services/thread/pre-match';
import { FixtureType } from '@milanbot/services/fixtures/types';

const createPreMatchThread = async() => {
  const prematch = new PreMatch("");
  await prematch.create();
};

export const preMatchRequestHandler = (async (req, res, next) => {
  console.log("Received pre-match request");
  const handlePreMatchRequest = async () => {
    const fixtureType = req.body as FixtureType;
    const fixture = new Fixture(fixtureType);
    await createPreMatchThread();
    await deletePreMatchCronJob();
    await createMatchCronJob(fixture, `${req.protocol}://${req.get('host')}`);
  };
  handlePreMatchRequest()
    .then(() => res.sendStatus(201))
    .catch(next);
}) as RequestHandler;
