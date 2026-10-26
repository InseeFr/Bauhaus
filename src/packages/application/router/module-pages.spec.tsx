import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { createMemoryRouter, RouterProvider, useParams } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ModuleOutlet, withModuleErrorBoundary } from "./module-pages";

/* Même montage que buildModuleRoutes : le layout du module porte le menu, ses pages passent
   par withModuleErrorBoundary. */
const renderModule = (page: ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(
    [
      {
        path: "/module",
        element: (
          <>
            <nav>module menu</nav>
            <ModuleOutlet />
          </>
        ),
        children: withModuleErrorBoundary([{ path: "page", element: page }]),
      },
    ],
    { initialEntries: ["/module/page"] },
  );
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

const SuspendedPage = ({ read }: { read: () => Promise<string> }) => {
  const { data } = useSuspenseQuery({ queryKey: ["page"], queryFn: read });
  return <p>{data}</p>;
};

describe("module pages", () => {
  afterEach(() => sessionStorage.clear());

  it("keeps the module menu while a page waits for its data", async () => {
    renderModule(<SuspendedPage read={() => new Promise(() => undefined)} />);

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByText("module menu")).toBeInTheDocument();
  });

  it("shows the error under the module menu when a page fails to load its data", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    renderModule(<SuspendedPage read={() => Promise.reject(new Error("boom"))} />);

    expect(await screen.findByText("An error has occurred")).toBeInTheDocument();
    expect(screen.getByText("module menu")).toBeInTheDocument();
  });

  it("loads the page again when the user retries", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const read = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue("page content");
    renderModule(<SuspendedPage read={read} />);

    await userEvent.click(await screen.findByRole("button", { name: "Try again" }));

    expect(await screen.findByText("page content")).toBeInTheDocument();
    expect(screen.getByText("module menu")).toBeInTheDocument();
  });

  it("shows the loading indicator when the user goes from one page to another that waits for its data", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const Item = () => {
      const { id } = useParams();
      const { data } = useSuspenseQuery({
        queryKey: ["item", id],
        queryFn: () =>
          id === "a" ? Promise.resolve("item a") : new Promise<string>(() => undefined),
      });
      return <p>{data}</p>;
    };
    const router = createMemoryRouter(
      [
        {
          path: "/module",
          element: <ModuleOutlet />,
          children: withModuleErrorBoundary([{ path: "item/:id", element: <Item /> }]),
        },
      ],
      { initialEntries: ["/module/item/a"] },
    );
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
    await screen.findByText("item a");

    await act(() => router.navigate("/module/item/b"));

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("item a")).not.toBeInTheDocument();
  });

  it("still reloads the application when a page chunk can no longer be fetched", async () => {
    using reload = vi.spyOn(window.location, "reload").mockImplementation(() => undefined);
    const queryClient = new QueryClient();
    const router = createMemoryRouter(
      [
        {
          path: "/module",
          element: <ModuleOutlet />,
          children: withModuleErrorBoundary([
            {
              path: "page",
              lazy: () =>
                Promise.reject(
                  new TypeError("Failed to fetch dynamically imported module: /assets/page.js"),
                ),
            },
          ]),
        },
      ],
      { initialEntries: ["/module/page"] },
    );
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    await screen.findByRole("status");
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
