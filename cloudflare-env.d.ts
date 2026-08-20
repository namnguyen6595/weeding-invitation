// Minimal ambient declaration for Cloudflare's built-in `cloudflare:workers`
// module (used by db/index.ts to read Worker bindings like `DB`). Without
// this, `tsc` reports "Cannot find module 'cloudflare:workers'" — harmless
// at runtime (the Cloudflare Vite plugin resolves it in workerd), but this
// keeps the editor/type-check clean without installing the full
// `@cloudflare/workers-types` package. Run `npx wrangler types` instead if
// you want fully-typed bindings generated from wrangler.jsonc.
declare module "cloudflare:workers" {
  export const env: { DB?: D1Database };
}
