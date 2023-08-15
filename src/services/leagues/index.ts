import { FootballAPI } from "@milanbot/common/api-football";

export class League extends FootballAPI {
  private id = 135;
  private path = "leagues";

  public async getCurrentSeason() {
    const { data } = await this.get(this.path, {
      id: this.id,
    });

    const { seasons } = data.response[0];

    const currentSeason = seasons.find(
      (season: { current: boolean }) => season.current
    );

    return currentSeason.year;
  }
}
