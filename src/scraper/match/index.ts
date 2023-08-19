import __espnfit__ from "@milanbot/scraper/__espnfitt__";

type Team = {
  id: string;
  displayName: string;
  isHome: boolean;
};

type TeamForm = {
  events: {
    gmResult: string;
    hmTeam: { id: string; displayName: string };
    awyTeam: { id: string; displayName: string };
  }[];
  team: { id: string; displayName: string };
};

type Statistics = {
  form: TeamForm[];
};

type GamePackage = {
  league: string;
  gmStrp: {
    // DateTime
    dt: string;
    status: {
      desc: string;
      det: string;
      id: string;
      state: string;
    };
    tms: Team[];
  };
  gmInfo: {
    loc: string;
    locAddr: {
      city: string;
    };
  };
  headToHead: {
    form: {
      events: {
        hmTeam: { id: string; displayName: string };
        awyTeam: { id: string; displayName: string };
        gmDate: string;
        parsedScore: string;
        lgName: string;
      }[];
    }[];
  };
  statistics: Statistics;
};

export class MatchPage {
  private url = "soccer/match/_/gameId/";
  private gameId: string;
  private gamepackge: GamePackage | undefined;

  private _home: Team | undefined;
  private _away: Team | undefined;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  public async load() {
    const { page } = await __espnfit__(this.page);

    this.gamepackge = page.content.gamepackage;
  }

  public get kickOff() {
    if (!this.gamepackge?.gmStrp.dt) return "Unknown";

    const date = new Date(this.gamepackge?.gmStrp.dt);
    const day = date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

    const time = date.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
      timeZone: "Europe/Rome",
    });

    return `${day} - ${time}`;
  }

  public get venue() {
    if (!this.gamepackge?.gmInfo?.loc) return "Unknown";

    const venue = this.gamepackge?.gmInfo?.loc;

    return venue;
  }

  public get home() {
    if (!this._home) {
      this._home = this.gamepackge?.gmStrp.tms.find((team) => team.isHome);
    }

    return this._home;
  }

  public get away() {
    if (!this._away) {
      this._away = this.gamepackge?.gmStrp.tms.find((team) => !team.isHome);
    }

    return this._away;
  }

  public get competition() {
    return this.gamepackge?.league;
  }

  public get homeForm() {
    if (!this.home?.id) return "Unknown";

    return this.getForm(this.home?.id);
  }

  public get awayForm() {
    if (!this.away?.id) return "Unknown";

    return this.getForm(this.away?.id);
  }

  public get headToHead() {
    return (
      this.gamepackge?.headToHead?.form?.[0]?.events?.map((event) => {
        return {
          date: event.gmDate,
          home: event.hmTeam.displayName,
          away: event.awyTeam.displayName,
          score: event.parsedScore,
          competition: event.lgName,
        };
      }) ?? []
    );
  }

  private getForm(teamId: string) {
    const form = this.gamepackge?.statistics.form.find(
      (team) => team.team.id === teamId
    );

    return form?.events.map((event) => {
      const isHome = event.hmTeam.id === teamId;

      const opponent = isHome ? event.awyTeam : event.hmTeam;

      return { result: event.gmResult, opponent: opponent.displayName };
    });
  }

  private get page() {
    return `${this.url}${this.gameId}`;
  }
}
