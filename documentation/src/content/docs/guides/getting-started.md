---
title: Getting started
---

Bauhaus is a single page application built with [React](https://facebook.github.io/react/) and [Redux](https://github.com/reactjs/reduxreact). It was bootstraped with [Create React App](https://github.com/facebook/create-react-app) and designed thanks to [Bootstrap](https://github.com/twbs/bootstrap). To run the application in development mode, run the following commands from a shell prompt in the local directory, and then navigate to [http://localhost:3000](http://localhost:3000):

```shell
# Download all the dependencies needed by the application
pnpm install
# Compiles the code and starts a minimal web server
pnpm start
```

Application needs externals Web services : Bauhaus-Back-Office(https://github.com/InseeFr/Bauhaus-Back-Office).

## Test

`pnpm test` runs the test watcher in an interactive mode. By default, runs tests related to files changed since the last commit.
An other script, `pnpm test:coverage` allows to generate a complete local report `Bauhaus/coverage/lcov-report/index.html`.

Unit tests are launched each time a `git push` is executed.

## Build

To build the application, run `yapnpmrn build`. You can now serve the content of the `dist` folder with the HTTP server of your choice.

For the deployment needs at INSEE, the CI will need to use the pnpm build command. This command will also create an archive (zip) containing the project in order to deploy it.

### Docker

You can also build a Docker container :

```shell
docker build . -t bauhaus-front
```

And run it :

```shell
docker run  -it -p 8083:80 -e VITE_API_BASE_HOST=http://192.168.1.12:8081/api bauhaus-front
```

`http://192.168.1.12:8081/api` is the base URL of the Bauhaus API.

## Target Architecture

The project is currently undergoing a gradual migration towards a modern and standardized technical stack. The DDI module (`src/packages/modules-ddi`) serves as the reference implementation for this target architecture.

### Technical Stack

The target stack we are migrating towards includes:

- **TypeScript (.tsx)**: All new code should be written in TypeScript for better type safety and developer experience
- **PrimeReact**: UI component library for building modern interfaces
- **react-i18next**: Industry-standard internationalization solution replacing legacy i18n approaches
- **Vitest**: For unit testing with mocking support for PrimeReact components
- **FormData API**: For form handling instead of useState when appropriate

### Module Structure

New modules should follow the architecture demonstrated in the DDI module:

```
src/packages/modules-{module-name}/
├── components/           # Reusable components specific to the module
│   ├── ComponentName.tsx
│   ├── ComponentName.spec.tsx
│   └── ComponentName.css
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization
│   ├── index.ts
│   └── locales/
│       ├── fr.json
│       └── en.json
├── pages/               # Page components
│   └── {object-name}.   # operation, series, indicator, ...
        ├── {page-name}/ # home, view, edit, search, ...
            │       ├── page.tsx
            │       └── menu.tsx
                    └── validation.ts
                    └── components/ # components for this current page
├── routes/              # Routing configuration
│   ├── index.tsx
│   └── layout.tsx
└── menu/                # Module horizontal menu
```

### Migration Guidelines

When working on existing modules:

1. **Gradual Migration**: Migrate files to TypeScript (.tsx) as you work on them
2. **Component Organization**: Extract reusable components into dedicated files with co-located styles and tests
3. **I18N**: Use react-i18next for new features, configure at the module level via layout component
4. **UI Components**: Prefer PrimeReact components over Bootstrap for new features
5. **Styling**: Use CSS files co-located with components, leverage CSS variables (e.g., `--color-1`, `--color-2`)
6. **Forms**: Use native HTML forms with FormData API and proper submit buttons
7. **Testing**: Write unit tests for all new components using Vitest, mock PrimeReact components when needed

The goal is to progressively align the entire codebase with these standards while maintaining backward compatibility during the transition period.

## Project Structure

In this paragraph, we will try to explain the rules we defined and try to follow when talking about the structure of the project.

### I18N

#### Legacy Approach (Deprecated)

In order to avoid big i18n file, we try to split this file in smaller files, based on `page` or `feature`. For example, we have a `src/js/i18n/dictionary/operations/documents.js` file for all messages dedicated to the documents feature.
This files have to be imported directly or not in the main file `js/i18n/dictionary/app.js`.

#### Modern Approach (Target)

For new modules, use **react-i18next** with JSON translation files organized by module:

```typescript
// Module i18n configuration
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

### Form Validation

For validating data defined in a form, we recommend using the open-source library **zod**.
