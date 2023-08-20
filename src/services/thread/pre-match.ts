import { MatchPage } from "@milanbot/scraper/match";
import ThreadHandler from "@milanbot/services/thread/handler";

class PreMatch {
  private gameId: string;
  private match: MatchPage | undefined;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  public async create() {
    const match = await this.getMatchData();

    const threadHandler = new ThreadHandler();

    const title = this.getTitle(match);

    const post = {
      title,
      text: this.generateContent(match),
      kind: "self",
    };

    await threadHandler.create(post);
  }

  public async exists() {
    const match = await this.getMatchData();

    const threadHandler = new ThreadHandler();

    const title = this.getTitle(match);

    const preMatchThread = await threadHandler.getByName(title);

    return Boolean(preMatchThread);
  }

  private getTitle(match: MatchPage) {
    const home = match.home;
    const away = match.away;

    return `[Pre-Match Thread] ${home?.displayName} vs ${away?.displayName}`;
  }

  private generateContent(match: MatchPage) {
    const matchInfo = this.generateMatchInfo(match);
    const headToHead = this.generateHeadToHead(match);
    const form = this.generateForm(match);
    const reminder =
      "*Reminder: Do not go to other team's subreddits to troll/bully/talk shit. Keep it in here.*";

    return [matchInfo, form, headToHead, reminder].join("\n\n");
  }

  private generateMatchInfo(match: MatchPage) {
    const matchTable = ["Match Info| |", ":--|--:"];

    const kickOff = match.kickOff;
    if (kickOff) {
      matchTable.push(`Kick-Off |	${match.kickOff}`);
    }

    const venue = match.venue;
    if (venue) {
      matchTable.push(`Venue | ${venue}`);
    }

    const competition = match.competition;
    if (competition) {
      matchTable.push(`Competition | ${competition}`);
    }

    return matchTable.join("\n");
  }

  private generateHeadToHead(match: MatchPage) {
    const headToHead = [
      "## Head To Head",
      "\n",
      "| Home | Score | Away | Date | Competition |",
      "| --- | --- | --- | --- | -- |",
    ];

    headToHead.push(
      ...match.headToHead.map(({ home, away, score, date, competition }) => {
        const formattedDate = new Date(date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });

        return `${home} | ${score} | ${away} | ${formattedDate} | ${competition}`;
      })
    );

    return headToHead.join("\n");
  }

  private generateForm(match: MatchPage) {
    const form = ["### Form"];

    const homeName = match.home?.displayName;
    const awayName = match.away?.displayName;

    const homeForm = match.homeForm;
    const awayForm = match.awayForm;

    form.push(`**${homeName}**\n`);
    if (Array.isArray(homeForm)) {
      form.push(`| Result | Opponent |`);
      form.push(`| --- | --- |`);
      homeForm.forEach(({ result, opponent }) => {
        form.push(`| ${result} | ${opponent} |`);
      });
    } else {
      form.push(`${homeForm}`);
    }

    form.push("\n\n");

    form.push(`**${awayName}**\n`);
    if (Array.isArray(awayForm)) {
      form.push(`| Result | Opponent |`);
      form.push(`| --- | --- |`);
      awayForm.forEach(({ result, opponent }) => {
        form.push(`| ${result} | ${opponent} |`);
      });
    } else {
      form.push(`${awayForm}`);
    }

    return form.join("\n");
  }

  private async getMatchData() {
    if (this.match) {
      return this.match;
    }

    const match = new MatchPage(this.gameId);
    await match.load();

    this.match = match;

    return match;
  }
}

export default PreMatch;
