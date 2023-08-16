import { client } from "@milanbot/common/client";
import type Fixture from "../fixture";
import { FootballData } from "@milanbot/common/football-data";

class FootballDataFixtures extends FootballData {
  protected path = `/v4/teams/${this.teamID}/matches`;

  protected fullURL = `${this.URL}${this.path}`;

  public async getFixtures(
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

  public async getTodaysFixtures() {
    const date = new Date().toISOString().split("T")[0];

    return this.getFixtures({
      dateFrom: date,
      dateTo: date,
    });
  }
}

export default FootballDataFixtures;
