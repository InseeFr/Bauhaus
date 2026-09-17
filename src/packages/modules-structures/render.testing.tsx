import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { AppContextProvider } from "../application/app-context";

const TestAppContextProvider = ({ children }: PropsWithChildren) => (
  <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
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
  }: {
    initialEntries?: string[];
    routes?: (children: ReactNode) => ReactNode;
  } = {}) =>
  ({ children }: PropsWithChildren) => (
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter initialEntries={initialEntries}>
        <TestAppContextProvider>{routes(children)}</TestAppContextProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

/** Rendu d'une page dans le contexte applicatif et un routeur, sans react-query. */
export const renderPageWithAppContext = (page: ReactNode) =>
  render(
    <TestAppContextProvider>
      <MemoryRouter>{page}</MemoryRouter>
    </TestAppContextProvider>,
  );

/** Les gestionnaires lisent `dataset.componentId` sur le parent de la cible : on clique l'icône. */
export const clickIcon = (button: HTMLElement) =>
  fireEvent.click(button.querySelector("span, svg") ?? button);

/** Ligne du tableau affichant la composante `identifiant`. */
export const rowOf = (identifiant: string) =>
  screen.getByText(`Composante ${identifiant}`).closest("tr") as HTMLElement;
