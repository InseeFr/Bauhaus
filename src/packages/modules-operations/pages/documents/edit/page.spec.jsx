import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { GeneralApi } from "@sdk/general-api";
import { Component } from "./page";

const params = vi.fn();
const location = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => params(),
  useLocation: () => location(),
}));

vi.mock("@sdk/general-api", () => ({ GeneralApi: { getDocument: vi.fn() } }));
vi.mock("@utils/hooks/codeslist", () => ({
  useCodesList: () => ({ codes: [{ code: "fr" }] }),
}));

vi.mock("./components/OperationsDocumentationEdition", () => ({
  OperationsDocumentationEdition: ({ document, id, type }) => (
    <form>
      <span>document:{document.labelLg1 ?? "(vide)"}</span>
      <span>id:{id ?? "(aucun)"}</span>
      <span>type:{type}</span>
    </form>
  ),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );

describe("Documents edit page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ id: "doc-1" });
    location.mockReturnValue({ pathname: "/operations/document/doc-1/modify" });
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
    location.mockReturnValue({ pathname: "/operations/link/doc-1/modify" });
    renderPage();

    await waitFor(() => expect(screen.getByText("type:link")).toBeInTheDocument());
    expect(GeneralApi.getDocument).toHaveBeenCalledWith("doc-1", "link");
  });

  it("ouvre directement un formulaire vide en création, sans rien demander au serveur", () => {
    params.mockReturnValue({});
    location.mockReturnValue({ pathname: "/operations/document/create" });
    renderPage();

    expect(screen.getByText("document:(vide)")).toBeInTheDocument();
    expect(screen.getByText("id:(aucun)")).toBeInTheDocument();
    expect(GeneralApi.getDocument).not.toHaveBeenCalled();
  });
});
