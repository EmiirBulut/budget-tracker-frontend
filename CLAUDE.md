# Claude Frontend Instructions — Budget Tracker

> Stack: React 19, TypeScript, Vite, TanStack Query, Zustand, React Hook Form + Zod, Axios, React Router v7
> These instructions extend the root CLAUDE.md. Both apply when working in this folder.

---

## 1. Project Structure

```
src/
├── assets/
│   ├── styles/           # Global styles, CSS variables, reset, typography
│   ├── images/
│   └── icons/
├── components/
│   └── ui/               # Shared base components: Button, Input, Modal, Badge, Card, etc.
├── features/
│   ├── auth/             # Login, Register, token management
│   ├── accounts/         # Account list, account detail, add account modal
│   ├── cards/            # Card list, card detail, add card modal (credit/debit)
│   ├── transactions/     # Add transaction modal (expense/income/installment), transaction list
│   ├── installments/     # Installment planner page, installment detail
│   ├── reports/          # Reports page, charts, export
│   └── settings/         # Settings page: profile, preferences, data management
│       └── [feature]/
│           ├── components/
│           ├── hooks/
│           ├── store/
│           ├── types/
│           └── api/
├── hooks/                # Global shared hooks
├── lib/                  # Utility functions, helpers, constants
├── pages/                # Route-level page components (thin wrappers over features)
├── router/               # React Router v7 config, route constants, ProtectedRoute
├── services/             # Axios instance, interceptors, base API setup
├── store/                # Global Zustand store root
├── types/                # Global TypeScript types and interfaces
└── main.tsx
```

---

## 2. TypeScript

- Always use **strict TypeScript** — no `any`, no `as unknown` suppression.
- Define types/interfaces in the relevant `types/` folder — not inline in components.
- Use `interface` for object shapes, `type` for unions, intersections, and aliases.
- All function parameters and return types must be explicitly typed.
- API response types must be defined — never leave API data untyped.

---

## 3. Components

- Use **functional components** exclusively. No class components.
- One component per file. Component filenames use **PascalCase**: `UserCard.tsx`, `LoginForm.tsx`.
- Keep components focused on a single visual responsibility. Split if doing more than one thing.
- Always define a `Props` interface for every component, even with a single prop.
- Use destructuring in the function signature:
  ```tsx
  interface Props {
    accountId: string;
    isActive: boolean;
  }
  const AccountCard = ({ accountId, isActive }: Props) => { ... }
  ```

### Naming Conventions
- Components: `PascalCase` → `AccountCard`, `AddTransactionModal`
- Hooks: `camelCase` with `use` prefix → `useAccounts`, `useTransactions`
- Event handlers: `handle` prefix → `handleSubmit`, `handleDelete`
- Boolean state/props: `is`, `has`, `can` prefix → `isLoading`, `hasError`, `canDelete`
- Route constants: `SCREAMING_SNAKE_CASE` → `ROUTES.DASHBOARD`, `ROUTES.CARDS`

---

## 4. State Management

- **Server state** → TanStack Query (`useQuery` for reads, `useMutation` for writes).
- **Global client state** → Zustand (auth session, UI preferences, dark mode).
- **Local UI state** → `useState` (modal open/close, toggles) or `useReducer` (complex local logic).
- Do not use Zustand for server data. Do not use TanStack Query for pure client state.
- Keep Zustand slices flat. No deeply nested state.
- Always define `queryKey` arrays as constants — never inline strings.

---

## 5. API Layer

- All API calls go through the shared **Axios instance** in `services/`.
- The instance handles: base URL from env, auth token injection via interceptor, 401 redirect, error normalization.
- Define each API call as a typed async function in `features/[feature]/api/`.
- No raw `fetch` calls. No Axios calls outside the `api/` layer.
- Wrap API functions in `useQuery`/`useMutation` hooks inside `features/[feature]/hooks/`.
- Invalidate related queries after mutations.

---

## 6. Forms

- All forms use **React Hook Form**.
- All validation uses **Zod**. Define schema first, derive type with `z.infer<>`.
- Error messages come from the Zod schema — not hardcoded in JSX.
- Never validate manually with `if` checks in submit handlers.

---

## 7. Routing

- All route definitions in `router/`. Route paths as constants in `router/routes.ts`.
- Use lazy loading for page-level components (`React.lazy` + `Suspense`).
- Protected routes handled through a `ProtectedRoute` component.
- Never hardcode route path strings outside of `router/routes.ts`.

---

## 8. Styling

- Use **CSS Modules** for component-level styling.
- Global styles (reset, variables, typography) in `assets/styles/` or `src/index.css`.
- No inline styles except truly dynamic values (e.g., calculated widths, dynamic colors).
- No external UI component libraries unless explicitly approved.
- CSS Module class names: `camelCase` → `.accountCard`, `.isActive`.

### Design Reference (from UI mockups)
- Primary color: `#2563EB` (blue) for active states, primary buttons, headers
- Account detail header: blue (`#2563EB`)
- Credit card colors: blue, purple, grey, green (user-selectable per card)
- Debit card color: green
- Income amounts: green text
- Expense amounts: red/dark text with `-` prefix
- Installment progress: orange bar
- Sidebar: white background, left-aligned nav with icons

---

## 9. Error Handling

- All async operations must handle error state explicitly in the UI.
- Use TanStack Query `isError`/`error` states — never silently swallow errors.
- Global error handling (401, 500) at Axios interceptor level.
- Never use empty `catch` blocks.

---

## 10. Performance

- `React.memo`, `useCallback`, `useMemo` only when there's a measurable reason — not by default.
- Lazy-load all page components via `React.lazy`.
- Keep state as local as possible to avoid unnecessary re-renders.

---

## 11. Code Cleanliness

- No `console.log` in committed code.
- No commented-out code blocks without explanation.
- No unused imports or variables.
- Destructure props and objects instead of repeated dot notation.
- Extract complex logic into variables or helper functions before the JSX return.

---

*Last updated: 2026-02-21*
