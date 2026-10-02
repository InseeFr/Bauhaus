import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RootError } from "./root-error";

/* Une route dont le chunk ne se charge pas, comme après un déploiement qui a renommé
   les fichiers référencés par l'index encore ouvert dans l'onglet. */
const renderFailingWith = (error: Error) => {
  const router = createMemoryRouter([
    {
      path: "/",
      errorElement: <RootError />,
      lazy: () => Promise.reject(error),
    },
  ]);
  render(<RouterProvider router={router} />);
};

const chunkError = () =>
  new TypeError(
    "Failed to fetch dynamically imported module: https://bauhaus/assets/layout-abc123.js",
  );

describe("<RootError />", () => {
  afterEach(() => sessionStorage.clear());

  it("reloads the page when a module chunk can no longer be fetched", async () => {
    using reload = vi.spyOn(window.location, "reload").mockImplementation(() => undefined);

    renderFailingWith(chunkError());

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("does not reload a second time when the chunk is still missing after a reload", async () => {
    using reload = vi.spyOn(window.location, "reload").mockImplementation(() => undefined);
    renderFailingWith(chunkError());
    await screen.findByRole("status");

    renderFailingWith(chunkError());

    expect(await screen.findAllByText("An error has occurred")).not.toHaveLength(0);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("shows an error page without reloading on any other error", async () => {
    using reload = vi.spyOn(window.location, "reload").mockImplementation(() => undefined);

    renderFailingWith(new Error("boom"));

    expect(await screen.findByText("An error has occurred")).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });
});
