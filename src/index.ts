import dotenv from "dotenv";
import "module-alias/register";
import schedule from "node-schedule";
import FixturesFactory from "./services/fixtures/factory";
import PreMatch from "./services/thread/pre-match";

dotenv.config();

(async () => {
  console.log("Running task");
  const fixtureService = new FixturesFactory().create();

  const fixtures = await fixtureService.getTodaysFixtures();

  console.log("fixtures", fixtures);

  if (!fixtures.length) {
    console.log("No fixtures today");
    return;
  }

  console.log("Scheduling prematch threads");

  // Create date 1 min after current time (Will be using the the match time minus 6 hours for the actual)
  const date = new Date();
  date.setMinutes(date.getMinutes() + 1);

  // Schedule prematch threads
  schedule.scheduleJob(date, async () => {
    console.log("Creating prematch threads");

    for await (const fixture of fixtures) {
      try {
        console.log("fixture", fixture);
        const prematch = new PreMatch(fixture);

        console.log("Creating prematch thread");
        await prematch.create();
        console.log("Prematch thread created");
      } catch (error) {
        console.log(error);
      }
    }
  });
})();

process.stdin.resume();
