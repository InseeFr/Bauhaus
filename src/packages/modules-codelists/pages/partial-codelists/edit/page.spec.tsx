import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { AppContextProvider } from "../../../../application/app-context";
import { testsI18n as i18n } from "../../../../tests/i18n";
import { Component } from "./page";

vi.mock("@sdk/index", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sdk/index")>();
  return {
    ...actual,
    CodelistsApi: {
      getCodelists: vi.fn(() =>
        Promise.resolve([{ id: "CL_PARENT", labelLg1: "Parent", uri: "http://parent" }]),
      ),
      getCodelistPartial: vi.fn(),
      getCodesListCodes: vi.fn(() => Promise.resolve({ items: [] })),
    },
  };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useParams: () => ({ id: "CL_UNKNOWN" }) };
});

const renderPage = () =>
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

describe("Partial codelist edit page", () => {
  it("displays the server error when the codelist cannot be loaded", async () => {
    (CodelistsApi.getCodelistPartial as Mock).mockRejectedValue({
      message: "CodeList not found",
      status: 404,
    });

    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent("CodeList not found");
  });
});
