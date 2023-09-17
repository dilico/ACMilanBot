import type { RequestHandler } from 'express';
import FixturesFactory from '@milanbot/services/fixtures/factory';
import { createPreMatchCronJob, createMatchCronJob, createPostMatchCronJob, deleteExistingCronJobs } from '@milanbot/scheduler';

const getTodaysFixtures = async () => {
  const fixtureService = new FixturesFactory().create();
  return await fixtureService.getFixtures(new Date());
};

export const scheduleRequestHandler = (async (req, res, next) => {
  console.log("Received schedule request");
  const handleScheduleRequest = async () => {
    const fixtures = await getTodaysFixtures();
    if (!fixtures.length) {
      res.sendStatus(204);
      return;
    }
    if (fixtures.length > 1) {
      res.sendStatus(400);
      return;
    }
    await deleteExistingCronJobs();
    const [ fixture ] = fixtures;
    const url = `${req.protocol}://${req.get('host')}`;
    await createPreMatchCronJob(fixture, url);
    await createMatchCronJob(fixture, url);
    await createPostMatchCronJob(fixture, url);
    res.sendStatus(201);
  };
  handleScheduleRequest()
    .catch(next);
}) as RequestHandler;
