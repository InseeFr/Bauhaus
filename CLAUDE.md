# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bauhaus is a React single-page application for managing statistical objects: concepts, classifications, operations, structures, datasets, and codelists. It requires the [Bauhaus-Back-Office](https://github.com/InseeFr/Bauhaus-Back-Office) API.

## Commands

```bash
npm install          # Install dependencies
npm run start        # Start dev server on localhost:3000
npm run build        # Production build to build/ directory
npm run test         # Run tests in watch mode
npm run test:coverage # Run all tests with coverage
npm run lint         # ESLint + Stylelint
npm run typecheck    # TypeScript type checking
npm run format       # Format with Prettier
npm run pre-push     # Full validation (format, lint, test)
```

Run a single test file:
```bash
npm run test -- path/to/file.spec.tsx
```

## Architecture

### Module Structure

The codebase uses a modular plugin architecture under `src/packages/`:

```
src/packages/
├── application/         # App shell, routing, context
├── auth/               # OIDC authentication
├── components/         # Shared UI components (50+)
├── model/              # TypeScript type definitions
├── sdk/                # API client layer
├── redux/              # State management (legacy)
├── utils/              # Utilities & custom hooks
├── styles/             # SCSS (Bootstrap-based)
├── modules-concepts/   # Concepts module
├── modules-classifications/
├── modules-operations/
├── modules-structures/
├── modules-datasets/
└── modules-codelists/
```

Each `modules-*` folder follows a consistent pattern:
- `routes/` - Route definitions with lazy loading
- `home/` - Module home page
- `visualization/` - View/read mode
- `edition/` - Edit/create mode
- `apis/` - Module-specific API calls
- `hooks/` - Module-specific React hooks
- `i18n/` - Module translations

### Path Aliases

Configured in `tsconfig.json`:
- `@components/*` → `src/packages/components/*`
- `@model/*` → `src/packages/model/*`
- `@sdk/*` → `src/packages/sdk/*`
- `@utils/*` → `src/packages/utils/*`

### State Management

- **React Query** (TanStack v5) - Primary data fetching with `useQuery`/`useMutation`
- **Redux** (v4 with thunk) - Legacy state for auth and reference data
- React Query is configured with `staleTime: Infinity` (aggressive caching)

### API Layer

The SDK (`src/packages/sdk/`) uses a factory pattern in `build-api.ts`:
- Function names determine HTTP verbs: `get*` → GET, `post*` → POST, `put*` → PUT, `delete*` → DELETE
- Automatic Bearer token injection via OIDC

### UI Framework

- **PrimeReact** - Enterprise components
- **Bootstrap 5** - Custom SCSS build for grid/utilities
- **Draft.js** - Rich text editing

### Authentication

OIDC-SPA integration. When `VITE_OIDC_ISSUER` is not set, a mock provider is used for development.

## Environment Variables

```
VITE_API_BASE_HOST   # API endpoint (default: http://localhost:8080/api)
VITE_OIDC_ISSUER     # OIDC provider URL (empty = mock auth)
VITE_OIDC_CLIENT_ID  # OIDC client ID
```

## Conventions

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
<type>(scope): description
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`

PR titles must also follow this format (enforced by GitHub Actions).

### Form Validation

Use **zod** for form validation.

### i18n

Split translation files by feature under each module's `i18n/` folder rather than maintaining large monolithic files.

## Git Branching

- `main` is always production (no `-RC` suffix)
- Version branches (e.g., `4.13.0`) are created for each release
- Feature PRs target version branches, not `main`
- After merging a version to `main`, rebase ongoing branches
