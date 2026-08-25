# Pablo Peace Guide Worker

This Worker uses Cloudflare Workers AI only to classify a visitor's words into a small approved set of wellbeing intents. Recommendation ranking remains deterministic and can return only entries from `../catalogue.json`.

## Privacy and safety

- Requests are limited to 280 characters and are not stored by the application.
- Responses use `cache-control: no-store`.
- Production browser access is limited to `pabloarellano.org` and `www.pabloarellano.org`.
- The model cannot create titles, descriptions, links, or wellbeing advice.
- If AI classification fails, the Worker uses the same deterministic keyword fallback as the website.

## Validate

Use Node.js 22 or newer.

```sh
npm install
npm run types
npm run check
```

## Deploy after approval

```sh
npx wrangler deploy
```

After deployment, put the resulting Worker origin in the empty `peace-guide-api` meta tag in `../guide.html`. The website continues to work without the Worker when the tag is empty.
