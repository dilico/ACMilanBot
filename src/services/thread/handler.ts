import { client } from "@milanbot/common/client";
import type { Post } from "@milanbot/services/thread/type";
import RedditAuth from "@milanbot/services/authentication/reddit";
import { BOT_VERSION } from "@milanbot/version";
import FormData from "form-data";

class ThreadHandler {
  private URL = "https://oauth.reddit.com/api/submit";

  public async create(post: Post) {
    await RedditAuth.authenticate();
    const token = RedditAuth.getToken();

    const form = new FormData();
    form.append("title", post.title);
    form.append("text", post.text);
    form.append("sr", process.env.REDDIT_SUBREDDIT ?? "");
    form.append("kind", post.kind);

    const response = await client.post(this.URL, form.getBuffer(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": `MilanBot:${BOT_VERSION}`,
        ...form.getHeaders(),
      },
    });

    console.log(response.data.jquery);
  }
}

export default ThreadHandler;
