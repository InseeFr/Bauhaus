---
title: Project Structure
---

## Module directory layout

All 7 domain modules (`concepts`, `classifications`, `operations`, `codelists`, `structures`, `datasets`, `ddi`) follow this structure:

```
src/packages/modules-{module-name}/
├── components/                         # Reusable components specific to the module
│     ├── ComponentName.css
│     ├── ComponentName.spec.tsx
│     └── ComponentName.tsx
├── hooks/                              # Custom React hooks
├── i18n/                               # Internationalization
│     ├── locales/
│     │     ├── en.json
│     │     └── fr.json
│     └── index.ts
├── menu/                               # Module horizontal menu
├── pages/
│     └── {object-name}/                # ex: indicators, operations, series, ...
│           └── {page-name}/            # ex: edit, home, search, view, ...
│                   ├── components/     # Components for this current page
│                   ├── page.tsx
│                   ├── menu.tsx
│                   └── validation.ts
├── routes/                             # Routing configuration
│     ├── index.tsx
│     └── layout.tsx
└── utils/                              # Utility functions used in the module
      ├── functionName.spec.ts
      └── functionName.ts
```

## Internationalization (I18N)

The project uses **react-i18next**.

### Isolated instances

Each of the 7 domain modules bootstraps its own isolated i18next instance (via `i18next.createInstance()`, never the raw global singleton) in `modules-{name}/i18n/index.ts`, exported as a named export:

```typescript
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { getLang } from "@utils/dictionary";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const conceptsI18n = i18next.createInstance();

conceptsI18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: getLang(),
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
  showSupportNotice: false,
});
```

Configure the i18n provider at the module level in your layout component (`routes/layout.tsx`), and use the `useTranslation()` hook in your components — it picks up the module's instance from context.

Two additional instances cover code that sits outside any single module:

- **`componentsI18n`** (`src/packages/components/i18n/`) — for shared UI components under `src/packages/components/` (buttons, pagination, dissemination status, etc.).
- **`appI18n`** (`src/packages/i18n/`) — for cross-cutting, always-loaded content that isn't tied to a lazy-loaded module: authentication, publication status wording, generic form/backend error messages (including the full backend error-code catalogue), and the module home page.

Components outside a module's own tree (i.e. anything under `src/packages/components/` or the small set of app-level files) bind to the correct instance explicitly, since there is no ambient module Provider to fall back on:

```typescript
const { t } = useTranslation("translation", { i18n: componentsI18n });
```

Outside of React rendering (e.g. a Zod validation schema built at module load time, or a plain utility function), call the instance directly: `appI18n.t("errors.mandatoryProperty", { propertyName })`.

### Second language

For UI that needs to display both configured languages at once (e.g. side-by-side lg1/lg2 fields), pass an explicit `lng` override rather than maintaining a second hook or a custom wrapper: `t(key, { lng: "en" })`.

## Form validation

Use [zod](https://zod.dev/) for validating form data. Co-locate the schema in a `validation.ts` file alongside the page it belongs to.
