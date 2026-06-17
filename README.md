# If You Had Known — World Archive

A fantasy world encyclopedia for the original novel **"If You Had Known."**
It will hold entries for characters, monsters/creatures, and locations, plus a
map of the known world — styled like an ancient archive / magical library.

Built with **Next.js** (App Router) + **React**, plain CSS (no Tailwind), and
**Vercel Postgres** for storing the authored content.

## How this project is being built (phases)

1. **Phase 1 — Boilerplate (done):** A clean Next.js project that deploys to
   Vercel. _(This is what's here now.)_
2. **Phase 2 — Storage:** Create a Postgres database in Vercel and connect it.
3. **Phase 3 — Authoring tool:** Internal forms to hand-author every character,
   monster, and location, saving each one to the database.
4. **Phase 4 — Public archive:** The encyclopedia pages — reusable cards,
   search/filter, individual profile pages, and a clickable world map.
   Light parchment theme overall; the monster section is more yellowed/aged.
5. **Phase 5 — Lock to static:** Freeze the content and remove the authoring UI.

## Running it locally

```bash
npm install      # install dependencies (only needed once)
npm run dev      # start the dev server
```

Then open http://localhost:3000 in your browser. The page reloads
automatically as you edit files.

```bash
npm run build    # create an optimized production build
npm run start    # run that production build locally
```

## Folder guide (so far)

```
app/
  layout.js          # wraps every page; sets fonts + browser tab title
  page.js            # the home page ("/")
  globals.css        # site-wide parchment theme + reusable variables
  page.module.css    # styles scoped to the home page only
public/              # static files (images, etc.) served as-is
```
