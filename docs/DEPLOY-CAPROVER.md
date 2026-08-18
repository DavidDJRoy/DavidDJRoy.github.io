# CapRover deployment (GitHub Actions)

Pushes to `main` build a lightweight nginx Docker image and deploy it to CapRover. Source is uploaded as a tarball; CapRover builds on the server (no container registry).

## One-time CapRover setup

1. **Create the app** in the CapRover dashboard before the first deploy.
   - Use a short lowercase name, e.g. `david-dj-roy`
   - This name must match `CAPROVER_APP_NAME` **exactly**
2. Open the app → **Deployment** → **Enable App Token** → copy the token
3. Enable **HTTP** (port 80) — the Dockerfile exposes nginx on port 80
4. Point the public domain (`daviddjroy.com`) at the app in CapRover
5. No persistent directories or env vars are required — this is a static site

## GitHub secrets

| Secret | Required | Example | Notes |
|--------|----------|---------|-------|
| `CAPROVER_SERVER` | Yes | `https://captain.apps.example.com` | CapRover **dashboard** URL |
| `CAPROVER_APP_NAME` | Yes | `david-dj-roy` | Exact app name — not a URL |
| `CAPROVER_APP_TOKEN` | Yes* | (Deployment tab) | App deploy token |
| `CAPROVER_PASSWORD` | Optional | Captain password | Auto-creates app if missing |
| `CAPROVER_OTP_TOKEN` | Optional | 2FA code | Required if dashboard has 2FA |

\* Use `CAPROVER_APP_TOKEN` **or** `CAPROVER_PASSWORD`.

**Find `CAPROVER_SERVER`:** open the CapRover dashboard in your browser and copy that URL (not the app's public URL).

## How the pipeline works

```mermaid
flowchart LR
  push[Push to main] --> validate[Validate + Docker smoke test]
  validate --> tarball[Create deploy.tar]
  tarball --> caprover[CapRover builds nginx image]
  caprover --> live[Site live at app URL]
```

On every push/PR to `main`, CI verifies required files exist and runs a Docker build smoke test (serves `index.html` and `app.js`).

On push to `main` only, CI uploads the repo tarball to CapRover. CapRover reads `captain-definition`, builds the nginx image from `Dockerfile`, and deploys it.

## Booking email

Set `BOOKING_EMAIL` in `app.js` to David's public inbox. Redeploy after changing it.

## Troubleshooting

### 404 "Nothing here yet" on deploy

The app name in `CAPROVER_APP_NAME` does not exist on your CapRover server. Create it in the dashboard or add `CAPROVER_PASSWORD` so CI creates it on first run.

### Wrong server URL

| Wrong | Right |
|-------|-------|
| `https://david-dj-roy.apps.example.com` | `https://captain.apps.example.com` |
| Your app's public URL | CapRover dashboard URL |

### Build fails locally but works in CI

Run the same smoke test CI uses:

```bash
docker build -t david-dj-roy:local .
docker run -d --name david-test -p 8080:80 david-dj-roy:local
curl http://localhost:8080/
docker rm -f david-test
```
