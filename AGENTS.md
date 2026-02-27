# AGENTS.md — Coding Agent Reference

This file provides guidance for agentic coding tools operating in this repository.

---

## Repository Overview

A monorepo containing:
- **`ideas/`** — Markdown/MDX idea documents (the content)
- **`apps/docs/`** — Astro-based static site that renders `ideas/` as a browsable documentation site
- **`prompts/`** — Prompt templates (e.g., `generate-document.md`)

The docs app is deployed to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`.

---

## Tech Stack

| Category       | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Astro 5 (static site generation)        |
| UI             | React 19 (interactive islands)          |
| Language       | TypeScript (strict mode)                |
| 3D rendering   | React Three Fiber / Three.js            |
| Live code      | Sandpack (CodeSandbox)                  |
| Testing        | Vitest                                  |
| Node version   | 18 (as used in CI)                      |

---

## Commands

All commands must be run from `apps/docs/` unless stated otherwise.

### Development

```bash
cd apps/docs
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:4321)
npm run build      # production build (outputs to dist/)
npm run preview    # preview the production build locally
```

### Testing

```bash
cd apps/docs
npm test           # run all tests (vitest)
```

#### Run a single test file

```bash
cd apps/docs
npx vitest run tests/buildTree.test.ts
```

#### Run a single test by name

```bash
cd apps/docs
npx vitest run --reporter=verbose -t "creates a single node"
```

### Type checking

```bash
cd apps/docs
npx astro check    # runs Astro's built-in type checker (includes .astro files)
```

There is no separate `lint` script; rely on `astro check` and TypeScript strict mode for correctness.

---

## Project Structure

```
/
├── ideas/                  # Markdown/MDX content (rendered as docs)
│   ├── games/
│   ├── basketball/
│   ├── house/
│   ├── monitor-riser/
│   └── *.md
├── apps/
│   └── docs/               # Astro app
│       ├── src/
│       │   ├── components/ # Astro + React components
│       │   │   └── react/  # React-only components (used with client:only)
│       │   ├── content/    # Astro content collection config
│       │   ├── pages/      # File-based routing
│       │   ├── pocs/       # Proof-of-concept interactive demos
│       │   ├── styles/     # Global CSS
│       │   ├── types/      # Shared TypeScript types
│       │   ├── utils/      # Pure utility functions
│       │   └── environment.ts  # Auto-generated paths/constants
│       ├── tests/          # Vitest unit tests
│       ├── astro.config.mjs
│       ├── tsconfig.json
│       └── package.json
├── prompts/                # Prompt templates
└── .github/workflows/      # CI/CD (deploy to GitHub Pages)
```

---

## Code Style Guidelines

### TypeScript

- TypeScript strict mode is enabled (`"extends": "astro/tsconfigs/strict"`).
- Always use `type` imports for types: `import type { Foo } from "./types/Foo"`.
- Prefer explicit return types on exported functions.
- Use `satisfies` for inline type assertions instead of `as` where possible (see tests).
- Avoid `any`; if unavoidable, isolate it and add a comment.
- Union types over enums: `type Theme = "dark" | "light"`.
- Keep types in `src/types/` as standalone `.ts` files, one type per file.

### Imports

- Use path aliases defined in `tsconfig.json`:
  - `@/*` → root of `apps/docs/`
  - `@components/*` → `src/components/`
  - `@utils/*` → `src/utils/`
  - `@types/*` → `src/types/`
  - `@pocs/*` → `src/pocs/`
  - `@jscad/*` → `src/@jscad/`
- Prefer alias imports over deep relative paths (e.g. `@utils/buildTree` over `../../utils/buildTree`).
- Group imports: external packages first, then internal aliases, then relative.
- Node built-ins use the `node:` protocol prefix: `import { pathToFileURL } from "node:url"`.

### Naming Conventions

- **Files**: `PascalCase` for components (`.astro`, `.tsx`), `camelCase` for utilities/hooks/types.
- **Types**: `PascalCase` (e.g., `TreeNode`, `FileResource`).
- **Functions**: `camelCase` verbs (e.g., `buildTree`, `loadFileResource`, `getTheme`).
- **Constants**: `UPPER_SNAKE_CASE` for module-level constants (e.g., `ROOT_NAME`, `DOCS_DIR`).
- **React components**: `PascalCase` default export matching filename.
- **React hooks**: prefix with `use` (e.g., `useTheme`).

### Components

- Astro components (`.astro`) for static/server-rendered markup.
- React components (`.tsx`) only for client-interactive islands; place in `src/components/react/`.
- Use `client:only="react"` for React components that require browser APIs.
- Props interfaces use the name `Props` and are exported: `export type Props = { ... }`.

### Formatting

- 2-space indentation.
- Double quotes for strings in TypeScript/TSX.
- Trailing commas in multi-line arrays/objects.
- No semicolons are not enforced — the existing code uses semicolons; keep consistency per file.

### Error Handling

- Throw descriptive `Error` instances: `throw new Error(\`Unknown file resource: \${resource}\`)`.
- Guard against missing/null values early and return/continue rather than deeply nesting.
- Use `typeof window === "undefined"` guards for SSR-safe browser API access.

### Content & Documentation

- All documentation/idea files live in `ideas/` as `.md` or `.mdx`.
- MDX files may use React components imported from `src/components/`.
- Frontmatter schema is in `src/content/config.ts`: `title` (optional string), `draft` (optional boolean).
- New idea directories go inside `ideas/` and are automatically picked up by the content collection.

---

## Adding a New Interactive Demo (PoC)

1. Create a directory in `apps/docs/src/pocs/<name>/`.
2. Implement the demo as a React component.
3. Write an Astro component wrapper
4. Reference it from an MDX file in `ideas/` using the alias `@pocs`.

## Adding 3D Models

1. Create a model using jscad in `apps/docs/src/pocs/<name>/` (see `apps/docs/src/pocs/monitor-riser-speaker-model/models/`), using size value objects from `apps/docs/src/pocs/values.ts`.
2. Import it from an MDX file in `ideas/` using the alias `@pocs`.
3. Import the JscadModelViewer (`import JscadModelViewer from "@jscad/components/JscadModelViewer.astro";`)
4. Embed it into the mdx file, optionally passing a `materials` registry

## Adding a New Test

- Place test files in `apps/docs/tests/` with the suffix `.test.ts`.
- Import from `vitest`: `import { describe, it, expect } from "vitest"`.
- Use `satisfies` to type mock data against real types.