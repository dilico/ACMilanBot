import type Fixture from "@milanbot/services/fixtures/fixture";
import ThreadHandler from "@milanbot/services/thread/handler";

class PreMatch {
  private fixture: Fixture;

  constructor(fixture: Fixture) {
    this.fixture = fixture;
  }

  public async create() {
    const threadHandler = new ThreadHandler();

    const post = {
      title: `[Pre-Match Thread] ${this.fixture.home.name} vs ${this.fixture.away.name}`,
      text: this.content,
      kind: "self",
    };

    await threadHandler.create(post);
  }

  private get content() {
    const { home, away } = this.fixture;

    const title = `# ${home.name} Vs ${away.name}\n`;
    const table = this.table;
    const reminder =
      "*Reminder: Do not go to other team's subreddits to troll/bully/talk shit. Keep it in here.*";

    return [title, table, reminder].join("\n");
  }

  private get table() {
    const { kickOff, venue, competition, round, referee } = this.fixture;

    return [
      "Match Info| |",
      ":--|--:",
      `Kick-Off |	${kickOff}`,
      venue ? `Venue   |	${venue}` : null,
      competition ? `Competition | ${competition}` : null,
      round ? `Round | ${round}` : null,
      referee ? `Referee | ${referee}` : null,
      "\n",
    ]
      .filter(Boolean)
      .join("\n");
  }
}

export default PreMatch;
