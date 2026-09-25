import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { GeneralApi } from "@sdk/general-api";

import { renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/general-api", () => ({ GeneralApi: { getDocument: vi.fn() } }));
vi.mock("@utils/hooks/codelist", () => ({
  useCodelist: () => ({ codes: [{ code: "fr", labelLg1: "Français" }] }),
}));

vi.mock("./components/OperationsDocumentationVisualization", () => ({
  OperationsDocumentationVisualization: ({ attr, type, langOptions }: any) => (
    <div>
      <span>document:{attr.labelLg1}</span>
      <span>id:{attr.id}</span>
      <span>type:{type}</span>
      <span>langues:{langOptions.codes.length}</span>
    </div>
  ),
}));
vi.mock("./menu", () => ({ Menu: ({ type }: any) => <nav>menu:{type}</nav> }));

const renderPage = (url = "/operations/document/doc-1") =>
  renderAtRoute(<Component />, "/operations/:type/:id", url);

describe("Documents view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GeneralApi.getDocument).mockResolvedValue({
      uri: "http://bauhaus/documents/doc-1",
      labelLg1: "Notice FR",
      labelLg2: "Notice EN",
    });
  });

  it("charge le document et en dérive l'identifiant depuis l'URI", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("document:Notice FR")).toBeInTheDocument());
    expect(screen.getByText("id:doc-1")).toBeInTheDocument();
    expect(GeneralApi.getDocument).toHaveBeenCalledWith("doc-1", "document");
  });

  it("passe les langues résolues à la vue", async () => {
    renderPage();

    await waitFor(() => expect(screen.getByText("langues:1")).toBeInTheDocument());
  });

  it("reconnaît un lien à son chemin", async () => {
    renderPage("/operations/link/doc-1");

    await waitFor(() => expect(screen.getByText("type:link")).toBeInTheDocument());
    expect(GeneralApi.getDocument).toHaveBeenCalledWith("doc-1", "link");
    expect(screen.getByText("menu:link")).toBeInTheDocument();
  });

  it("retombe sur le libellé de seconde langue pour le titre", async () => {
    vi.mocked(GeneralApi.getDocument).mockResolvedValue({
      uri: "http://bauhaus/documents/doc-1",
      labelLg2: "Only EN",
    });
    renderPage();

    await waitFor(() => expect(screen.getByText("id:doc-1")).toBeInTheDocument());
    expect(screen.getAllByText("Only EN").length).toBeGreaterThan(0);
  });
});
