# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start development server (Vite)
yarn build      # Type-check then bundle for production (tsc -b && vite build)
yarn lint       # Run ESLint
yarn preview    # Serve the production build locally
```

There are no tests. There is no single-test runner command.

## Environment Setup

Copy `.env.example` to `.env` and fill in Firebase credentials. All env vars are prefixed with `VITE_` and accessed via `import.meta.env`.

## Architecture

### Data Flow — Dual Storage Pattern

`SnippetService` (`src/services/snippetService.ts`) is the central singleton for all snippet/collection CRUD. It checks `auth.currentUser` on every operation:
- **Authenticated** → reads/writes to Firestore (`snippets`, `collections`, `favorites` collections)
- **Guest** → reads/writes to `localStorage` under keys `snippets`, `collections`, `favorites`

This means guest data is silently lost on sign-out (`authService.signOut()` clears localStorage). When adding new data operations, always implement both paths.

### Auth

`AuthContext` (`src/contexts/AuthContext.tsx`) wraps the whole app and **blocks rendering** until `onAuthStateChanged` resolves (`{!loading && children}`). The context exposes `useAuth()` — use this hook in any component that needs the current user.

Auth supports Google OAuth and GitHub OAuth via Firebase Auth popups. User profiles are upserted in Firestore (`users/{uid}`) on every login via `authService.createUserProfile()`.

### Routing & Layout

All routes are defined in `src/App.tsx`. The layout is:
- `AuthProvider` → `HelmetProvider` → `Router`
- Inside: `Sidebar` (collapsible, auto-opens on ≥768px) + `Navbar` + animated `<main>`
- Page transitions use Framer Motion `AnimatePresence` with `opacity` variants keyed on `location.pathname`

### Firestore Schema

Four top-level collections:
- `users/{uid}` — user profile, owner-only write
- `snippets/{id}` — has `userId`, `collectionId?`, public read
- `collections/{id}` — has `userId`, `snippetIds[]`, public read
- `favorites/{uid}` — `{ snippetIds: string[] }`, owner-only read/write

Security rules are in `firestore.rules`. Snippets and collections are publicly readable; writes require auth + ownership.

### Type Definitions

Types are split across two places — keep them in sync when changing data shapes:
- `src/data/schema.ts` — canonical `User`, `Snippet`, `Collection` interfaces (also contains sample data)
- `src/services/snippetService.ts` — local `Snippet` and `Collection` interfaces used within the service (slight divergence from schema types)

### Key Patterns

- `src/components/index.ts` — barrel export for all shared components; add new components here
- `src/pages/index.ts` — barrel export for all pages
- `useKeyboardShortcuts` hook is registered globally in `AppContent`; shortcut config lives in `src/types/shortcuts.ts`
- SEO meta tags are managed per-page via the `SEO` component (wraps `react-helmet-async`)
- Toast notifications use `react-hot-toast`; import `toast` directly, do not create new Toaster instances

### Deployment

Deployed on Vercel. `vercel.json` rewrites all routes to `/index.html` for SPA routing.
