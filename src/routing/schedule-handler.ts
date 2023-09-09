import type { RequestHandler } from 'express';
import FixturesFactory from '@milanbot/services/fixtures/factory';
import { createPreMatchCronJob } from '@milanbot/scheduler';

const getTodaysFixtures = async () => {
  const fixtureService = new FixturesFactory().create();
  return await fixtureService.getFixtures(new Date());
};

export const scheduleRequestHandler = (async (req, res, next) => {
  console.log("Received schedule request");
  const handleScheduleRequest = async () => {
    const fixtures = await getTodaysFixtures();
    if (!fixtures.length) {
      res.status(204);
      return;
    }
    if (fixtures.length > 1) {
      res.status(400);
      return;
    }
    await createPreMatchCronJob(fixtures[0], `${req.protocol}://${req.get('host')}`);
  };
  handleScheduleRequest()
    .then(() => res.sendStatus(201))
    .catch(next);
}) as RequestHandler;
