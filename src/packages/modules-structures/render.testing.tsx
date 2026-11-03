import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, screen } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";
import { MemoryRouter } from "react-router";

import { AppContextProvider, AppProperties } from "../application/app-context";

const NO_PROPERTIES = {} as AppProperties;

const TestAppContextProvider = ({ children }: PropsWithChildren) => (
  <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
    {children}
  </AppContextProvider>
);

/**
 * Wrapper react-query + routeur + contexte applicatif. `routes` permet d'insérer des
 * `<Routes>` autour du composant testé.
 */
export const createStructuresWrapper =
  ({
    initialEntries,
    routes = (children) => children,
    queryClient,
  }: {
    initialEntries?: string[];
    routes?: (children: ReactNode) => ReactNode;
    /** Client à observer (invalidations) ; un client neuf par rendu sinon. */
    queryClient?: QueryClient;
  } = {}) =>
  ({ children }: PropsWithChildren) => (
    <QueryClientProvider
      client={queryClient ?? new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter initialEntries={initialEntries}>
        <TestAppContextProvider>{routes(children)}</TestAppContextProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

/** Les gestionnaires lisent `dataset.componentId` sur le parent de la cible : on clique l'icône. */
export const clickIcon = (button: HTMLElement) =>
  fireEvent.click(button.querySelector("span, svg") ?? button);

/** Ligne du tableau affichant la composante `identifiant`. */
export const rowOf = (identifiant: string) =>
  screen.getByText(`Composante ${identifiant}`).closest("tr") as HTMLElement;

/** Champ de formulaire d'identifiant `id`. */
export const field = (id: string) => document.getElementById(id)!;

/** Saisit `value` dans le champ d'identifiant `id`. */
export const type = (id: string, value: string) =>
  fireEvent.change(field(id), { target: { value } });
