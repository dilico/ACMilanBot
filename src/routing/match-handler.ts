import type { RequestHandler } from 'express';
import Fixture from '@milanbot/services/fixtures/fixture';
import Match from '@milanbot//services/thread/match';
import { FixtureType } from '@milanbot/services/fixtures/types';

const createMatchThread = async(fixture: Fixture) => {
  const match = new Match("");
  await match.create();
};

export const matchRequestHandler = (async (req, res, next) => {
  console.log("Received match request");
  const handlePreMatchRequest = async () => {
    const fixtureType = req.body as FixtureType;
    const fixture = new Fixture(fixtureType);
    await createMatchThread(fixture);
    res.sendStatus(201);
  };
  handlePreMatchRequest()
    .catch(next);
}) as RequestHandler;
