# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` using Next.js App Router.
  - Routes: `src/app/**/page.tsx`, API: `src/app/api/**/route.ts`.
  - UI: `src/components/{ui,layout,auth,admin,...}` (PascalCase components, `.tsx`).
  - Utilities: `src/lib/*.ts`, types: `src/types/`.
- Assets: `public/`.
- Config: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `middleware.ts`.
- Env: `.env.local` (dev), `.env.production` (deploy). Never commit secrets.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server (Turbopack).
- `npm run build`: Production build via Next.js.
- `npm start`: Serve built app (uses `$PORT` for hosting).
- `npm run lint`: ESLint checks using `eslint-config-next`.
- `npm run ui:add`: Add shadcn/ui components interactively.
- Heroku: `bash heroku-config.sh` to set env vars (requires Heroku CLI; review values first).

## Coding Style & Naming Conventions
- Language: TypeScript + React 19, Next.js 15 (App Router), Tailwind CSS v4.
- Indentation: 2 spaces; prefer named exports; components in PascalCase; hooks as `useX`.
- Files: React components `*.tsx`; utilities/types `*.ts`; API routes `route.ts`.
- Styling: Tailwind utility classes; co-locate component-specific styles; keep class lists readable.
- Linting: Fix issues per `npm run lint`; align with `eslint.config.mjs`. Use editor format-on-save.

## Testing Guidelines
- No formal test suite configured yet. For changes, provide manual verification steps (affected routes, screenshots, edge cases).
- If adding tests, prefer React Testing Library for components and Playwright for e2e; place under `src/**/__tests__/` and name `*.test.ts(x)`.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits where possible (`feat:`, `fix:`, `chore:`, etc.). Keep messages imperative and scoped (e.g., `fix: adjust login form spacing`).
- Branches: short, kebab-case by scope (e.g., `feat-admin-rfid-printing`).
- PRs: include purpose, linked issue, screenshots for UI, steps to reproduce/verify, and notes on env/config changes. Keep PRs small and focused.

## Security & Configuration Tips
- Never commit tokens or secrets; use `.env.local`/Heroku config. Public values should start with `NEXT_PUBLIC_`.
- Middleware (`middleware.ts`) affects auth and routing—test impacted paths after changes.
