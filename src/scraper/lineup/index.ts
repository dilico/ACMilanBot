import __espnfit__ from "@milanbot/scraper/__espnfitt__";
import { Lineup, LineupResponse } from "./types";

export class LineupPage {
  private url = "soccer/lineups/_/gameId/";
  private gameId: string;
  private homeLineup: LineupResponse | undefined;
  private awayLineup: LineupResponse | undefined;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  public async load() {
    const { page } = await __espnfit__(this.page);

    const { lineUps } = page.content.gamepackage;

    this.homeLineup = lineUps.find(
      (lineup: LineupResponse) => lineup.team.homeAway === "home"
    );
    this.awayLineup = lineUps.find(
      (lineup: LineupResponse) => lineup.team.homeAway === "away"
    );
  }

  public get home() {
    if (!this.homeLineup) {
      return;
    }

    return this.generateLineup(this.homeLineup);
  }

  public get away() {
    if (!this.awayLineup) {
      return;
    }

    return this.generateLineup(this.awayLineup);
  }

  private generateLineup(lineup: LineupResponse): Lineup {
    const players = lineup.players.map((player) => ({
      ...lineup.playersMap[player],
    }));

    const substitutes = [...lineup.substitutes, ...lineup.unused].map(
      (player) => ({
        ...lineup.playersMap[player],
      })
    );

    const hasLineup = players.length > 0;

    return {
      hasLineup,
      formation: lineup.formation,
      players,
      substitutes,
    };
  }

  private get page() {
    return `${this.url}${this.gameId}`;
  }
}
