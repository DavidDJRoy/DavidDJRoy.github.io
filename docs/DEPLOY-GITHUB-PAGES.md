# GitHub Pages

Live site: [https://daviddjroy.github.io/](https://daviddjroy.github.io/)

This is a static site. The `DavidDJRoy/DavidDJRoy.github.io` repo publishes `main` from the repo root (GitHub Pages user site).

## Remotes

| Remote | Repo | Role |
|--------|------|------|
| `origin` | `hackmods/david-dj-roy` | Working copy / history |
| `pages` | `DavidDJRoy/DavidDJRoy.github.io` | Public GitHub Pages host |

After a change:

```bash
git push origin main
git push pages main
```

## One-time

Pages is already on for this user site (`main`, `/`). No GitHub Action is required to publish HTML.

## Custom domain later

To serve `daviddjroy.com` from Pages, add a `CNAME` file with that host and point DNS at GitHub. Until then the public URL is `https://daviddjroy.github.io/`.
