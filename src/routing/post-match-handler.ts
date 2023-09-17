import type { RequestHandler } from 'express';
import Fixture from '@milanbot/services/fixtures/fixture';
import PostMatch from '@milanbot//services/thread/post-match';
import { FixtureType } from '@milanbot/services/fixtures/types';

const createPostMatchThread = async(fixture: Fixture) => {
  const postMatch = new PostMatch("");
  await postMatch.create();
};

export const postMatchRequestHandler = (async (req, res, next) => {
  console.log("Received post-match request");
  const handlePostMatchRequest = async () => {
    const fixtureType = req.body as FixtureType;
    const fixture = new Fixture(fixtureType);
    await createPostMatchThread(fixture);
    res.sendStatus(201);
  };
  handlePostMatchRequest()
    .catch(next);
}) as RequestHandler;
