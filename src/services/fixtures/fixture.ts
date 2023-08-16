import type { FixtureType } from "./types";

class Fixture {
  private fixture: FixtureType;

  constructor(fixture: FixtureType) {
    this.fixture = fixture;
  }

  public get home() {
    return this.fixture.home;
  }

  public get away() {
    return this.fixture.away;
  }

  public get kickOff() {
    const date = new Date(this.fixture.date);
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
    return `${this.fixture.venue.name} - (${this.fixture.venue.city})`;
  }

  public get competition() {
    return this.fixture.competition.name;
  }

  public get round() {
    return this.fixture.round;
  }

  public get referee() {
    return this.fixture.referee;
  }
}

export default Fixture;
