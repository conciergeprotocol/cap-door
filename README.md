# CAP door

A [Concierge Agent Protocol](https://conciergeprotocol.org) door that answers AI agents from your website's pages. Set `SITE_URL` and deploy. There is no code to write.

It reads up to 50 pages, starting with the home page and the pages it links to, plus your `llms.txt` when you have one. Answers come from those pages and end with a link to the page used.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fconciergeprotocol%2Fcap-door&project-name=cap-door&repository-name=cap-door&env=SITE_URL&envDescription=The%20website%20this%20door%20answers%20for%2C%20such%20as%20https%3A%2F%2Fharborgoods.example&envLink=https%3A%2F%2Fgithub.com%2Fconciergeprotocol%2Fcap-door%23settings)

On Vercel, the door signs in to AI Gateway on its own, so `SITE_URL` is the only setting. Messages are kept in memory. Add a Postgres database from the project's Storage tab to keep them across restarts, and make sure it sets `DATABASE_URL`.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Fconciergeprotocol%2Fcap-door)

Render asks for `SITE_URL` and `AI_GATEWAY_API_KEY` and runs on the free plan. A free instance sleeps when idle, so the first question after a quiet spell is slow, and messages reset when it restarts. Add a disk at `/app/data` on a paid instance, or set `DATABASE_URL`, to keep them.

**Fly.io**

```sh
fly launch --from https://github.com/conciergeprotocol/cap-door --no-deploy
fly volumes create cap_data --size 1
fly secrets set SITE_URL=https://harborgoods.example AI_GATEWAY_API_KEY=...
fly deploy
```

**Railway**

Create a service from this repository, add a volume mounted at `/app/data`, and set `SITE_URL` and `AI_GATEWAY_API_KEY`.

**Anywhere else**

The `Dockerfile` runs on any host that keeps a disk at `/app/data`. On a host without a disk, set `DATABASE_URL` to Postgres.

## Settings

| Variable | |
| --- | --- |
| `SITE_URL` | The website this door answers for. Required. |
| `AI_GATEWAY_API_KEY` | An [AI Gateway](https://vercel.com/docs/ai-gateway) key. Not needed on Vercel. |
| `SITE_NAME` | The name in `agent.txt`. Defaults to the home page title. |
| `CHAT_URL` | The page where people chat with you, for the `Chat` line. |
| `PUBLIC_URL` | The door's public origin, when it differs from the request host. |
| `CAP_MODEL` | The model. Without it, the door tries Claude Sonnet, then models a free AI Gateway key can call. |
| `CAP_DAILY_TOKENS` | Model tokens per UTC day for the whole door. Default 500000. |
| `CAP_DAILY_LIMIT` | Messages per caller per UTC day. Default 50. |
| `DATABASE_URL` | Postgres instead of SQLite. |

## Publish it

1. Open `https://<your-door>/agent.txt`. Serve that text at `https://<your-site>/agent.txt`, or redirect that path to it.
2. Add this line to the `<head>` of your home page:

   ```html
   <link rel="agent" href="https://<your-site>/agent.txt">
   ```

3. Check it at [conciergeprotocol.org/check](https://conciergeprotocol.org/check).

## Run it locally

```sh
cp .env.example .env   # set SITE_URL and AI_GATEWAY_API_KEY
npm install
npm start
npm run check
```

Node.js 22.13 or newer.

## License

Apache 2.0
