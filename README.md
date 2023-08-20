# ACMilanBot
Say hello to the Bot for the AC Milan subreddit.

## Match thread creation
### Step 1 - Schedule
A cron job runs every day at 00:05 UTC to check if there's a match on that day. In case there is a match, a new cron job is created that runs 12 hours before kick off.

Example request:
```bash
curl -X POST http://localhost:3000/schedule
```

### Step 2 - Pre-Match
12 hours before kick off, a cron job creates the Pre-Match thread on Reddit. It also deletes itself and creates a new cron job that runs 30 minutes before kick off.

Example request:
```bash
curl -X POST http://localhost:3000/pre-match \
   -H 'Content-Type: application/json' \
   -d '{"competition":{"name":"Serie A"},"date":"2023-08-25T20:25:00","venue":{},"home":{"name":"AC Milan"},"away":{"name":"Boca Juniors"},"goals":{}}'
```

### Step 3 - Match
30 minutes before kick off, a cron job creates the Match thread on Reddit. It also deletes itself and creates a new cron job that runs every minute.

### Step 4 - Live and Post-Match
A cron job follows the match minute by minute. When the match is over, it creates the Post-Match thread on Reddit and it deletes itself.