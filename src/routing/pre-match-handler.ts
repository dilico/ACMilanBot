import type { RequestHandler } from 'express';
import Fixture from '@milanbot/services/fixtures/fixture';
import PreMatch from '@milanbot//services/thread/pre-match';
import { FixtureType } from '@milanbot/services/fixtures/types';

const createPreMatchThread = async(fixture: Fixture) => {
  const preMatch = new PreMatch("");
  await preMatch.create();
};

export const preMatchRequestHandler = (async (req, res, next) => {
  console.log("Received pre-match request");
  const handlePreMatchRequest = async () => {
    const fixtureType = req.body as FixtureType;
    const fixture = new Fixture(fixtureType);
    await createPreMatchThread(fixture);
    res.sendStatus(201);
  };
  handlePreMatchRequest()
    .catch(next);
}) as RequestHandler;
