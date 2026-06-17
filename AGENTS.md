<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deploy workflow — always use PRs

This repo deploys via Vercel under **Juliana's** account. The usual local git
identity here is **rohenaz**, who is not the deploy owner — so Vercel will
**block** deployments that come from commits pushed by rohenaz (e.g. direct
pushes to `main`).

Therefore: **never push directly to `main`.** Always work on a branch and open a
**pull request**, so Juliana can merge it from her own account. The merge is
authored by her, which authorizes the production deploy. Make a PR for every
change, even small ones.
