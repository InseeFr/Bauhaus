import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { GeneralApi } from "@sdk/general-api";

import { useCodelist } from "@utils/hooks/codelist";

import { renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/general-api", () => ({ GeneralApi: { getDocument: vi.fn() } }));
vi.mock("@utils/hooks/codelist");

vi.mock("./components/OperationsDocumentationEdition", () => ({
  OperationsDocumentationEdition: ({ document, id, type }: any) => (
    <form>
      <span>document:{document.labelLg1 ?? "(vide)"}</span>
      <span>id:{id ?? "(aucun)"}</span>
      <span>type:{type}</span>
    </form>
  ),
}));

const renderPage = (url = "/operations/document/doc-1/modify") =>
  renderAtRoute(<Component />, ["/operations/:type/:id/modify", "/operations/:type/create"], url);

describe("Documents edit page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCodelist).mockReturnValue({ codes: [{ code: "fr" }] } as any);
    vi.mocked(GeneralApi.getDocument).mockResolvedValue({
      uri: "http://bauhaus/documents/doc-1",
      labelLg1: "Notice FR",
    });
  });

  it("charge le document à modifier et en dérive l'identifiant", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("document:Notice FR")).toBeInTheDocument());
    expect(GeneralApi.getDocument).toHaveBeenCalledWith("doc-1", "document");
    expect(screen.getByText("type:document")).toBeInTheDocument();
  });

  it("reconnaît un lien à son chemin", async () => {
    renderPage("/operations/link/doc-1/modify");

    await waitFor(() => expect(screen.getByText("type:link")).toBeInTheDocument());
    expect(GeneralApi.getDocument).toHaveBeenCalledWith("doc-1", "link");
  });

  it("ouvre directement un formulaire vide en création, sans rien demander au serveur", () => {
    renderPage("/operations/document/create");

    expect(screen.getByText("document:(vide)")).toBeInTheDocument();
    expect(screen.getByText("id:(aucun)")).toBeInTheDocument();
    expect(GeneralApi.getDocument).not.toHaveBeenCalled();
  });
});
