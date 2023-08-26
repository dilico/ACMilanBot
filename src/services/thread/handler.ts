import { client } from "@milanbot/common/client";
import type { Post } from "@milanbot/services/thread/type";
import RedditAuth from "@milanbot/services/authentication/reddit";
import packageJson from "package.json";
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
        "User-Agent": `MilanBot:${packageJson.version}`,
        ...form.getHeaders(),
      },
    });

    console.log(response.data.jquery);
  }

  public async update(name: string, post: Post) {
    throw new Error("Not implemented");
  }

  public async getByName(name: string) {
    const posts = await this.getPosts();
    const currentUTC = Date.now() / 1000;

    const post = posts.data.children.find((post: any) => {
      const created_utc = post.data.created_utc;

      const timeSincePost = currentUTC - created_utc;
      const wasCreatedToday = timeSincePost <= 24 * 60 * 60;

      const title = post.data.title;
      const isByBot = post.data.author === process.env.REDDIT_USERNAME;

      return title === name && wasCreatedToday && isByBot;
    });

    return post;
  }

  private async getPosts() {
    const url = `https://www.reddit.com/r/${process.env.REDDIT_SUBREDDIT}/new.json?sort=new&limit=100`;

    const { data } = await client.get(url);

    return data;
  }
}

export default ThreadHandler;
