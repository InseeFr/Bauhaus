---
title: Project Structure
---

## Module directory layout

New modules follow this structure (the DDI module is the reference implementation):

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

### Modern approach (target)

Use **react-i18next** with JSON translation files organized by module:

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: "fr",
  fallbackLng: "fr",
});
```

Configure the i18n provider at the module level in your layout component, and use the `useTranslation` hook in your components.

### Legacy approach (deprecated)

Translation files are split by page or feature under `src/js/i18n/dictionary/` and imported into the main `js/i18n/dictionary/app.js` file. Do not use this approach for new work.

## Form validation

Use [zod](https://zod.dev/) for validating form data. Co-locate the schema in a `validation.ts` file alongside the page it belongs to.
