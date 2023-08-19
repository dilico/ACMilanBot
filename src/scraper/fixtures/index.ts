import __espnfit__ from "@milanbot/scraper/__espnfitt__";
import { Event } from "@milanbot/scraper/fixtures/types";

export class FixturePage {
  private url = "soccer/team/fixtures/_/id/103/ita.ac_milan";
  private events: Event[] = [];

  public async load() {
    const { page } = await __espnfit__(this.page);

    this.events = page.content.fixtures.events;
  }

  public getToday() {
    const today = this.removeTimeFromDate(new Date().toISOString());

    return this.events.find(
      (event) => this.removeTimeFromDate(event.date) === today
    );
  }

  public getEvents() {
    return this.events;
  }

  private get page() {
    return this.url;
  }

  private removeTimeFromDate(date: string) {
    return new Date(date).toISOString().split("T")[0];
  }
}
