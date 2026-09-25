import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

import { AppContextProvider } from "../../application/app-context";
import { testsI18n as i18n } from "../../tests/i18n";

/** Rend `ui` avec react-query (sans retry), i18n, un routeur mémoire et le contexte applicatif. */
export const renderWithProviders = (ui: ReactNode) =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
            {ui}
          </AppContextProvider>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
