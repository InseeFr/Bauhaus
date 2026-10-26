import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";

import { AppContextProvider } from "../application/app-context";
import { ModuleOutlet, withModuleErrorBoundary } from "../application/router/module-pages";

const NO_PROPERTIES = {} as any;

/** Client neuf par rendu, sans nouvelle tentative : un rejet s'affiche aussitôt. */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

/**
 * Rend une page comme dans l'application : sous la route `path`, ouverte à `route`, derrière le
 * `Suspense` et l'encart d'erreur d'un module (TQ0b), dans le contexte applicatif (fr/en).
 * `useParams` lit l'URL réelle, sans mock de `react-router`. Le client est rendu pour amorcer ou
 * observer le cache (invalidations).
 */
export const renderWithQuery = (
  ui: ReactNode,
  {
    path = "/",
    route = path,
    queryClient = createTestQueryClient(),
  }: { path?: string; route?: string; queryClient?: QueryClient } = {},
) => {
  const router = createMemoryRouter(
    [{ element: <ModuleOutlet />, children: withModuleErrorBoundary([{ path, element: ui }]) }],
    { initialEntries: [route] },
  );

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
          <RouterProvider router={router} />
        </AppContextProvider>
      </QueryClientProvider>,
    ),
    queryClient,
    router,
  };
};
