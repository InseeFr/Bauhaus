import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { createMemoryRouter, MemoryRouter, Route, RouterProvider, Routes } from "react-router";
import { expect, it, Mock, vi } from "vitest";

import { AppContextProvider } from "../../application/app-context";

type Properties = Record<string, unknown>;

// Un client neuf par rendu, sans nouvelle tentative : un rejet s'affiche aussitôt.
const renderWithProperties = (ui: ReactNode, properties: Properties) =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={properties as any}>
        {ui}
      </AppContextProvider>
    </QueryClientProvider>,
  );

/**
 * Rend l'écran derrière une vraie route, ouverte à `url` : `useParams` et `useLocation`
 * lisent alors l'URL réelle, sans mock de `react-router`.
 */
export const renderAtRoute = (
  ui: ReactNode,
  paths: string | string[],
  url: string,
  properties: Properties = {},
) =>
  renderWithProperties(
    <MemoryRouter initialEntries={Array.of(url)}>
      <Routes>
        {[paths].flat().map((path) => (
          <Route key={path} path={path} element={ui} />
        ))}
      </Routes>
    </MemoryRouter>,
    properties,
  );

/**
 * Rend l'écran dans un routeur de données dont la route a déjà chargé `loaderData` :
 * `useLoaderData` le rend immédiatement, sans mock de `react-router`.
 */
export const renderWithLoaderData = (
  ui: ReactNode,
  loaderData: unknown,
  { path = "/", url = "/" }: { path?: string; url?: string } = {},
) => {
  // Sans loader déclaré, le routeur démarre initialisé avec les données d'hydratation.
  const router = createMemoryRouter([{ id: "page", path, element: ui }], {
    initialEntries: [url],
    hydrationData: { loaderData: { page: loaderData } },
  });
  return renderWithProperties(<RouterProvider router={router} />, {});
};

// --- Écrans de visualisation publiables -------------------------------------------------

const PUBLICATION_ERROR = "Publication refusée";

/** Fabrique du mock de `./menu` : un seul bouton, branché sur la prop `callback`. */
export const publishMenuModule = (callback: string) => ({
  Menu: (props: Record<string, () => void>) => <button onClick={props[callback]}>publier</button>,
});

const clickPublishWhenReady = async () => {
  await waitFor(() => expect(screen.getByRole("button", { name: "publier" })).toBeInTheDocument());
  await userEvent.click(screen.getByRole("button", { name: "publier" }));
};

interface Publication {
  renderPage: () => void;
  publish: unknown;
  load: unknown;
  entity: unknown;
}

export const itPublishesThenReloads = (
  name: string,
  { renderPage, publish, load, entity }: Publication,
) =>
  it(name, async () => {
    renderPage();

    await clickPublishWhenReady();

    await waitFor(() => expect(publish).toHaveBeenCalledWith(entity));
    await waitFor(() => expect(load).toHaveBeenCalledTimes(2));
  });

export const itShowsPublicationError = (
  name: string,
  { renderPage, publish }: Publication,
  thenExpect: () => void = () => {},
) =>
  it(name, async () => {
    vi.mocked(publish as Mock).mockRejectedValue(PUBLICATION_ERROR);
    renderPage();

    await clickPublishWhenReady();

    await waitFor(() => expect(screen.getByText(PUBLICATION_ERROR)).toBeInTheDocument());
    thenExpect();
  });

// --- Écrans d'accueil listant des éléments triés ----------------------------------------

/** Liste de remplacement : un item par élément, son libellé pour contenu. */
export const LabelList = ({ items }: { items: { id: string; label: string }[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>{item.label}</li>
    ))}
  </ul>
);

export const expectLoading = () => expect(screen.getByText(/Loading/i)).toBeInTheDocument();

export const expectListSortedByLabel = async () => {
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
  expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Abeille");
};

export const expectEmptyList = async () => {
  await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
};
