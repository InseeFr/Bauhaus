import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { AppContextProvider } from "../../../../application/app-context";
import { testsI18n as i18n } from "../../../../tests/i18n";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { CodelistsApi } from "@sdk/index";
import { Component } from "./page";

vi.mock("@sdk/index", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sdk/index")>();
  return {
    ...actual,
    CodelistsApi: {
      getDetailedCodelist: vi.fn(),
      getCodesDetailedCodelist: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
      publishCodelist: vi.fn(),
      deleteCodelist: vi.fn(),
    },
  };
});

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return { ...actual, usePrivileges: vi.fn(), useUserStamps: vi.fn() };
});

describe("Codelist view page", () => {
  beforeEach(() => {
    (usePrivileges as Mock).mockReturnValue({ privileges: [] });
    (useUserStamps as Mock).mockReturnValue({ data: [{ stamp: "stamp" }] });
  });

  it("displays the server error when the codelist cannot be loaded", async () => {
    (CodelistsApi.getDetailedCodelist as Mock).mockRejectedValue({
      message: "CodeList not found",
      status: 404,
    });

    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
              <Component />
            </AppContextProvider>
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("CodeList not found");
  });
});
