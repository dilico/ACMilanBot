import __espnfit__ from "./__espnfitt__";
import { CommentaryPage } from "./commentary";
import { FixturePage } from "./fixtures";
import { LineupPage } from "./lineup";

// TODO: Create cron job that runs once per hour
async function checkForFixtures() {
  const fixtures = new FixturePage();
  await fixtures.load();
  const event = fixtures.getToday();

  if (!event) {
    console.log("No event for today");
    return;
  }

  // If it is 6 hours before the game, create the pre match thread.
  const timeUntilGame = new Date(event.date).getTime() - Date.now();
  const sixHours = 6 * 60 * 60 * 1000;
  const shouldCreatePreMatchThread = timeUntilGame <= sixHours;

  // TODO: Need to find a nice way to make it so it doesn't create a pre-match thread if one already exists.
  //       Maybe we can check the subreddit for a thread with the same title and if it exists, don't create it.
  //       As it will currently create 6 pre match threads for the same game.

  if (!shouldCreatePreMatchThread) {
    return console.log("No need to create a pre match thread");
  }

  // TODO:
  // createPreMatchThread(event);

  // If it is 1 hour before the game, create the 1 min cron job.
  // TODO:
  // createMatchCronJob(event);
}

// TODO: Create cron job that runs once per minute
async function checkForMatchUpdates(gameId: string) {
  const lineup = new LineupPage(gameId);
  await lineup.load();

  const home = lineup.home;
  const away = lineup.away;

  if (!home?.hasLineup || !away?.hasLineup) {
    return console.log("No lineups available");
  }

  const commentary = new CommentaryPage(gameId);
  await commentary.load();

  const keyEvents = commentary.get();

  // Create match thread
  // TODO: If the match thread already exists, then edit it to update instead of creating a new one.
  // createMatchThread(home, away, keyEvents);

  if (commentary.isMatchOver()) {
    // TODO:
    // createPostMatchThread(home, away);
    // cancelMatchCronJob(gameId);
  }
}
