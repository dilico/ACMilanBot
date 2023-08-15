import FootballAPIFixtures from "./api-football";
import FootballDataFixtures from "./football-data";

class FixturesFactory {
  create(type = "football-api") {
    if (type === "football-api") {
      return new FootballAPIFixtures();
    }

    return new FootballDataFixtures();
  }
}

export default FixturesFactory;
