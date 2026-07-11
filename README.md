# Pat Guettler — Resume Site

Personal resume website designed for GitHub Pages, with a secret **PrintForge Arena** mini-game.

**Live (after you deploy):** `https://patguettler.github.io/resume/`  
(or your custom domain)

## What’s included

- Single-page resume: about, experience, projects, skills, contact
- Responsive layout, scroll motion, forge-workshop visual direction
- Secret game unlock (see below)
- Static files only — no build step required

## Secret game

Recruiters (or anyone curious) can unlock **PrintForge Arena**:

1. **Konami code** — ↑ ↑ ↓ ↓ ← → ← → B A  
2. **Type** `forge`, `printforge`, or `unicorn` anywhere on the page  
3. **Click** the filament spool in the footer **5 times**

There’s also a hint in the browser console.

Pick Cinderpaw, Aquafin, or Voltwig and duel Stonepup — a tiny taste of [PrintForge Legends](https://github.com/PatGuettler/3DPrintBattles).

## Deploy to GitHub Pages

1. Create a new repo (e.g. `resume` or `patguettler.github.io`)
2. Push this folder to `main`
3. In the repo: **Settings → Pages → Source:** Deploy from branch `main` / root (`/`)
4. Wait a minute, then open the Pages URL

If the repo is named `patguettler.github.io`, the site will be at the root of your GitHub Pages domain.

### Optional: GitHub Actions

Not required for this static site. Branch deploy is enough.

## Local preview

```bash
# From this directory — any static server works
python3 -m http.server 8080
# then open http://localhost:8080
```

## Customize

| File | What to edit |
|------|----------------|
| `index.html` | Copy, roles, project links, contact |
| `css/styles.css` | Colors, type, layout |
| `js/game.js` | Unlock methods, battle balance |
| `assets/` | Creature sprites |

LinkedIn experience wasn’t fully scrapeable from here — dates/titles are based on your public GitHub work and local projects. Tweak the Experience section to match your LinkedIn exactly before sending to employers.

## Links

- GitHub: [PatGuettler](https://github.com/PatGuettler)
- LinkedIn: [pat-guettler-0745b71b5](https://www.linkedin.com/in/pat-guettler-0745b71b5)
- Email: patguettler@gmail.com
