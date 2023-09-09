import type { FootballAPIFixtureType } from "../types";
import Fixture from "../fixture";
import { FootballAPI } from "@milanbot/common/api-football";
import { League } from "@milanbot/services/leagues";

class FootballAPIFixtures extends FootballAPI {
  protected path = `fixtures`;

  protected fullURL = `${this.URL}${this.path}`;

  private async getFixturesFromAPI(
    params: Record<string, string> = {}
  ): Promise<Fixture[]> {
    const league = new League();
    const season = await league.getCurrentSeason();

    const { data } = await this.get(this.path, {
      team: this.teamID,
      season,
      ...params,
    });

    return data.response.map((fixture: FootballAPIFixtureType) =>
      this.transformFootballAPIToFixture(fixture)
    );
  }

  public async getFixtures(date: Date) {
    const day = date.toISOString().split("T")[0];
    // const date = new Date().toISOString().split("T")[0];

    return this.getFixturesFromAPI({
      day,
    });
  }

  private transformFootballAPIToFixture(
    fixture: FootballAPIFixtureType
  ): Fixture {
    return new Fixture({
      competition: {
        name: fixture.league.name,
        logo: fixture.league.logo,
      },
      referee: fixture.fixture.referee,
      date: fixture.fixture.date,
      round: fixture.league.round,
      season: fixture.league.season,
      status: fixture.fixture.status.short,
      venue: {
        name: fixture.fixture.venue.name,
        city: fixture.fixture.venue.city,
      },
      home: {
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo,
      },
      away: {
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo,
      },
      goals: {
        home: fixture.goals.home,
        away: fixture.goals.away,
      },
      score: {
        halftime: {
          home: fixture.score.halftime.home,
          away: fixture.score.halftime.away,
        },
        fulltime: {
          home: fixture.score.fulltime.home,
          away: fixture.score.fulltime.away,
        },
        extratime: {
          home: fixture.score.extratime.home,
          away: fixture.score.extratime.away,
        },
        penalty: {
          home: fixture.score.penalty.home,
          away: fixture.score.penalty.away,
        },
      },
      winner: fixture.teams.home.winner
        ? fixture.teams.home.name
        : fixture.teams.away.name,
    });
  }
}

export default FootballAPIFixtures;
