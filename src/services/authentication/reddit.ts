import { client } from "@milanbot/common/client";
import { version } from "package.json";
import FormData from "form-data";

class RedditAuthentication {
  private accessToken: string | null = null;
  private redditAuthURL = "https://www.reddit.com/api/v1/access_token";

  public async authenticate() {
    const form = new FormData();
    form.append("grant_type", "password");
    form.append("username", process.env.REDDIT_USERNAME ?? "");
    form.append("password", process.env.REDDIT_PASSWORD ?? "");

    const { data } = await client.post(this.redditAuthURL, form.getBuffer(), {
      auth: {
        username: process.env.REDDIT_CLIENT_ID ?? "",
        password: process.env.REDDIT_CLIENT_SECRET ?? "",
      },
      headers: {
        ...form.getHeaders(),
        "User-Agent": `MilanBot:${version}`,
      },
    });

    this.accessToken = data.access_token;
  }

  public getToken() {
    return this.accessToken;
  }
}

export default new RedditAuthentication();
