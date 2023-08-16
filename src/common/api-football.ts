import { AxiosRequestConfig } from "axios";
import { client } from "@milanbot/common/client";

export class FootballAPI {
  protected URL = "https://api-football-v1.p.rapidapi.com/v3/";
  protected teamID = 489;

  public get(
    path: string,
    params: Record<string, string | number> = {},
    config: AxiosRequestConfig = {}
  ) {
    return client.get(`${this.URL}${path}`, {
      params,
      ...config,
      headers: {
        "X-RapidAPI-Key": process.env.FOOTBALL_API_API_KEY ?? "",
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    });
  }
}
