import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AppContextProvider } from "../../application/app-context";

/**
 * Rend une page du module dans le contexte applicatif (fr/en) et un routeur mémoire, avec au
 * besoin un QueryClient sans relance pour les pages qui s'appuient sur react-query.
 */
export const renderClassificationsPage = (
  page: ReactElement,
  { withQueryClient = false }: { withQueryClient?: boolean } = {},
) => {
  const routed = <MemoryRouter>{page}</MemoryRouter>;
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      {withQueryClient ? (
        <QueryClientProvider client={queryClient}>{routed}</QueryClientProvider>
      ) : (
        routed
      )}
    </AppContextProvider>,
  );
};

/**
 * Rend `element` sur la route `path`, atteinte par `url`, sous un QueryClient par défaut : les
 * pages d'édition lisent leurs identifiants dans les paramètres de route.
 */
export const renderOnRoute = (element: ReactElement, path: string, url: string) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path={path} element={element} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
