import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { GeneralApi } from "@sdk/general-api";
import { Component } from "./page";

vi.mock("@sdk/general-api", () => ({
  GeneralApi: { getDocumentsList: vi.fn() },
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

describe("Documents home page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement tant que la liste n'est pas là", () => {
    vi.mocked(GeneralApi.getDocumentsList).mockReturnValue(new Promise(() => {}) as any);
    render(<Component />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("trie les documents par libellé et en dérive l'identifiant depuis l'URI", async () => {
    vi.mocked(GeneralApi.getDocumentsList).mockResolvedValue([
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
    render(<Component />);

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Abeille|doc-1|fr|2026-01-01");
    expect(screen.getAllByRole("listitem")[1]).toHaveTextContent("Zèbre|doc-2|fr|2026-01-02");
  });

  it("retombe sur le libellé de seconde langue, et découpe les espaces", async () => {
    vi.mocked(GeneralApi.getDocumentsList).mockResolvedValue([
      { labelLg1: "", labelLg2: "  Second language  ", uri: "http://bauhaus/documents/doc-3" },
    ] as any);
    render(<Component />);

    await waitFor(() =>
      expect(screen.getByRole("listitem")).toHaveTextContent("Second language|doc-3"),
    );
  });

  it("tolère un document sans URI ni date", async () => {
    vi.mocked(GeneralApi.getDocumentsList).mockResolvedValue([{ labelLg1: "Sans URI" }] as any);
    render(<Component />);

    await waitFor(() => expect(screen.getByRole("listitem")).toHaveTextContent("Sans URI||"));
  });
});
