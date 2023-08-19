import __espnfit__ from "@milanbot/scraper/__espnfitt__";

type Commentary = {
  dtls: string;
  shrtDtls: string;
  time: string;
  type: string;
};

/**
 * Scrapes the commentary of a match.
 *
 * This is a seperate page, due to the fact that it is only partially available on the match page.
 */
export class CommentaryPage {
  private url = "soccer/commentary/_/gameId/";
  private gameId: string;
  private keyEvents: Commentary[] = [];
  // Doesn't really belong here :/
  private gameStatus: string = "pre";

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  public async load() {
    const { page } = await __espnfit__(this.page);

    const { mtchCmmntry, gmStrp } = page.content.gamepackage;

    if (!mtchCmmntry) {
      return;
    }

    const { keyEvents } = mtchCmmntry;

    if (!keyEvents) {
      return;
    }

    this.keyEvents = keyEvents;
    this.gameStatus = gmStrp?.status?.state ?? "pre";
  }

  public get() {
    return this.keyEvents;
  }

  public isMatchOver() {
    const lastEvent = this.keyEvents.at(-1);

    const isCommentaryOver = lastEvent?.type === "end-match";
    const isMatchOver = this.gameStatus === "post";

    return isCommentaryOver || isMatchOver;
  }

  private get page() {
    return `${this.url}${this.gameId}`;
  }
}
