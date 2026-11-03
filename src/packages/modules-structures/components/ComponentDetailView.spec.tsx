import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Component } from "@model/structures/Component";

import { CodelistsApi } from "@sdk/codelists-api";

import { AppContextProvider, AppProperties } from "../../application/app-context";
import { createQueryClient } from "../../application/query-client";
import { XSD_CODE_LIST } from "../constants/xsd";
import { ComponentDetailView } from "./ComponentDetailView";

vi.mock("@sdk/codelists-api", () => ({ CodelistsApi: { getCodelistsPartial: vi.fn() } }));

vi.mock("./CodelistPanel", () => ({ CodelistPanel: () => null }));
vi.mock("../pages/components/view/menu", () => ({ ViewMenu: () => null }));

const component = {
  id: "c1",
  labelLg1: "Composante",
  range: XSD_CODE_LIST,
  codeList: "http://partial/1",
} as unknown as Component;

const NO_PROPERTIES = {} as AppProperties;

const renderView = (queryClient = createQueryClient()) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={NO_PROPERTIES}>
          <ComponentDetailView component={component} handleBack={vi.fn()} updatable={false} />
        </AppContextProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe("ComponentDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(CodelistsApi.getCodelistsPartial).mockResolvedValue([
      { uri: "http://partial/1", labelLg1: "Liste partielle", id: "PARTIAL_1" },
    ]);
  });

  it("affiche le libellé de la liste partielle de la composante", async () => {
    renderView();

    expect(await screen.findByText("Liste partielle")).toBeInTheDocument();
  });

  it("reprend les listes partielles lues il y a moins d'une minute", async () => {
    const queryClient = createQueryClient();
    renderView(queryClient).unmount();
    await vi.waitFor(() => expect(CodelistsApi.getCodelistsPartial).toHaveBeenCalledOnce());

    renderView(queryClient);

    expect(await screen.findByText("Liste partielle")).toBeInTheDocument();
    expect(CodelistsApi.getCodelistsPartial).toHaveBeenCalledOnce();
  });
});
