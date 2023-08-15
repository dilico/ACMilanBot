import FixturesFactory from "@milanbot/services/fixtures/factory";

export default async function () {
  // Get all the fixtures for the day
  const fixtureService = new FixturesFactory().create();

  const fixtures = await fixtureService.getTodaysFixtures();

  if (!fixtures.length) {
    return;
  }

  //
  // Setup any scheduled posts that are needed
  // - Pre Match Thread (6 hours before kickoff)
  // - Match Thread (30 minutes before kickoff)
  // - Post Match Thread (As soon as the match ends)
  //
  // If there are no fixtures for the day, then do nothing
}
