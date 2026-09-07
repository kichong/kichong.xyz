# KICHONG.XYZ fire links

A reusable, full-screen personal links template built with React and Vite. KICHONG.XYZ is the first example: a living painterly flame surrounded by an evenly spaced, continuously moving orbit of links, with understated YouTube playback controls.

The current public experience is intentionally presentation-only. It has no visible login, add button, or editing interface.

## Optional template and owner editing

The repository retains an optional Supabase-backed owner system for a future iteration. It includes:

- passwordless email authentication;
- owner-only link and media editing;
- reusable custom icons for added destinations;
- public database reads with row-level security;
- persistent content that works with a frontend deployed on Vercel.

This system is currently disabled by `ENABLE_ADMIN = false` in `src/App.jsx`. Changing that flag restores the login and editor entry points, but the feature should only be enabled after Supabase is configured and the included database policies have been applied.

## Local development

```bash
npm install
npm run dev
```

The four example links and default media work without a backend. Follow [SETUP.md](./SETUP.md) if you want to configure the optional Supabase system and deploy the frontend to Vercel.

## Commands

```bash
npm run lint
npm run build
```
