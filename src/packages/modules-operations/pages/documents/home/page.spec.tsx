import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { DocumentsApi } from "@sdk/documents";

import { expectItemLoadFailed } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { expectLoading, renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("@sdk/documents", () => ({
  DocumentsApi: { getDocumentsAndLinksList: vi.fn() },
}));

vi.mock("./components/DocumentHome", () => ({
  DocumentHome: ({ documents }: any) => (
    <ul>
      {documents.map((document: any) => (
        <li key={document.id}>
          {document.label}|{document.id}|{document.lang}|{document.updatedDate}
        </li>
      ))}
    </ul>
  ),
}));

const renderPage = () => renderAtRoute(<Component />, "/documents", "/documents");

describe("Documents home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(DocumentsApi.getDocumentsAndLinksList).mockReturnValue(new Promise(() => {}) as any);
    renderPage();

    expectLoading();
  });

  it("trie les documents par libellé et en dérive l'identifiant depuis l'URI", async () => {
    vi.mocked(DocumentsApi.getDocumentsAndLinksList).mockResolvedValue([
      {
        labelLg1: "Zèbre",
        uri: "http://bauhaus/documents/doc-2",
        lang: "fr",
        updatedDate: "2026-01-02",
      },
      {
        labelLg1: "Abeille",
        uri: "http://bauhaus/documents/doc-1",
        lang: "fr",
        updatedDate: "2026-01-01",
      },
    ] as any);
    renderPage();

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Abeille|doc-1|fr|2026-01-01");
    expect(screen.getAllByRole("listitem")[1]).toHaveTextContent("Zèbre|doc-2|fr|2026-01-02");
  });

  it("retombe sur le libellé de seconde langue, et découpe les espaces", async () => {
    vi.mocked(DocumentsApi.getDocumentsAndLinksList).mockResolvedValue([
      { labelLg1: "", labelLg2: "  Second language  ", uri: "http://bauhaus/documents/doc-3" },
    ] as any);
    renderPage();

    await waitFor(() =>
      expect(screen.getByRole("listitem")).toHaveTextContent("Second language|doc-3"),
    );
  });

  it("tolère un document sans URI ni date", async () => {
    vi.mocked(DocumentsApi.getDocumentsAndLinksList).mockResolvedValue([
      { labelLg1: "Sans URI" },
    ] as any);
    renderPage();

    await waitFor(() => expect(screen.getByRole("listitem")).toHaveTextContent("Sans URI||"));
  });

  it("affiche l'échec de chargement de la liste au lieu d'une liste vide", async () => {
    vi.mocked(DocumentsApi.getDocumentsAndLinksList).mockRejectedValue(sdkRejection.emptyBody(500));
    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
