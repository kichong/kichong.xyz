# KICHONG.XYZ fire links

A reusable, full-screen personal links template built as a static HTML/CSS experience with Vite. KICHONG.XYZ is the first example: a smoothly flickering painterly flame surrounded by evenly spaced, fixed destination links. The public page ships no runtime JavaScript or third-party font requests.

The current public experience is intentionally presentation-only. It has no visible login, add button, or editing interface.

## Optional template and owner editing

The repository retains an unloaded React/Supabase owner-editor module for a future iteration. It includes:

- passwordless email authentication;
- owner-only link editing;
- reusable custom icons for added destinations;
- public database reads with row-level security;
- persistent content that works with a frontend deployed on Vercel.

The dormant editor lives in `src/admin/DormantEditor.jsx` and is not imported by the public page, keeping its authentication dependencies out of visitors' downloads. Re-enabling it requires wiring the editor into an application entry point after Supabase is configured and the included database policies have been applied.

## Local development

```bash
npm install
npm run dev
```

The four example links work without a backend. Follow [SETUP.md](./SETUP.md) if you want to configure the optional Supabase system and deploy the frontend to Vercel.

## Commands

```bash
npm run lint
npm run build
```
