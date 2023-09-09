import { client } from "@milanbot/common/client";
import type Fixture from "../fixture";
import { FootballData } from "@milanbot/common/football-data";

class FootballDataFixtures extends FootballData {
  protected path = `/v4/teams/${this.teamID}/matches`;

  protected fullURL = `${this.URL}${this.path}`;

  private async getFixturesFromAPI(
    params: Record<string, string> = {}
  ): Promise<Fixture[]> {
    const { data } = await client.get(this.fullURL, {
      params: {
        ...params,
      },
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "",
      },
    });

    return data;
  }

  public async getFixtures(date: Date) {
    const day = date.toISOString().split("T")[0];
    return this.getFixturesFromAPI({
      dateFrom: day,
      dateTo: day,
    });
  }
}

export default FootballDataFixtures;
