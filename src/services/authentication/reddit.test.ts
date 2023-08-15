import RedditAuthentication from "./reddit";

describe("RedditAuthentication", () => {
  jest.mock("package.json", () => ({ version: "mock_version" }));

  const mockClient = {
    post: jest
      .fn()
      .mockResolvedValue({ data: { access_token: "mocked_access_token" } }),
  };

  jest.mock("form-data", () => ({
    append: jest.fn(),
    getBuffer: jest.fn(),
    getHeaders: jest.fn(),
  }));

  beforeAll(() => {
    jest.mock("@milanbot/client", () => ({ client: mockClient }));
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.unmock("@milanbot/client");
    jest.unmock("form-data");
  });

  test("should authenticate and set access token", async () => {
    const redditAuth = RedditAuthentication;

    // Set environment variables
    process.env.REDDIT_USERNAME = "mock_username";
    process.env.REDDIT_PASSWORD = "mock_password";
    process.env.REDDIT_CLIENT_ID = "mock_client_id";
    process.env.REDDIT_CLIENT_SECRET = "mock_client_secret";

    await redditAuth.authenticate();

    expect(mockClient.post).toHaveBeenCalledWith(
      "https://www.reddit.com/api/v1/access_token",
      expect.any(FormData), // FormData instance
      {
        auth: {
          username: "mock_client_id",
          password: "mock_client_secret",
        },
        headers: {
          ...expect.any(Object), // Headers object
          "User-Agent": "MilanBot:mock_version", // Assuming you have 'version' defined in your package.json
        },
      }
    );

    expect(redditAuth.getToken()).toBe("mocked_access_token");
  });

  test("should return null token when not authenticated", () => {
    const redditAuth = RedditAuthentication;

    const token = redditAuth.getToken();

    expect(token).toBeNull();
  });
});
