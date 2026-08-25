import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AppContextProvider } from "../../../application/app-context";
import D from "../../../deprecated-locales";
import { DOCUMENT } from "../utils";
import OperationsDocumentationEdition from "./edition";

// Référence stable : la liste est une dépendance d'effet dans le composant.
const documentsAndLinks = [];
vi.mock("@utils/hooks/documents", () => ({
  useDocumentsAndLinks: () => ({ data: documentsAndLinks }),
}));

/**
 * Le bouton « Choose » de PrimeReact contient l'input file et le re-clique : sous
 * happy-dom, qui n'implémente pas le flag « click in progress », userEvent.upload
 * part en récursion infinie. On déclenche donc le change directement.
 */
const selectFile = (container, file) =>
  fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });

const renderEdition = (document = {}) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{}}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <OperationsDocumentationEdition
            document={document}
            type={DOCUMENT}
            langOptions={{ codes: [] }}
          />
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );

describe("OperationsDocumentationEdition, file field", () => {
  it("offers a drop zone and a button to browse when no file is attached yet", () => {
    renderEdition();

    screen.getByText(D.drag);
    screen.getByRole("button", { name: D.chooseFile });
  });

  it("replaces the drop zone by the file name once a file is selected", () => {
    const { container } = renderEdition();

    selectFile(container, new File(["content"], "rapport.pdf", { type: "application/pdf" }));

    screen.getByText("rapport.pdf");
    expect(screen.queryByText(D.drag)).toBeNull();
  });

  it("brings the drop zone back when the attached file is removed", async () => {
    const { container } = renderEdition();

    selectFile(container, new File(["content"], "rapport.pdf", { type: "application/pdf" }));
    await userEvent.click(screen.getByRole("button", { name: D.removeFile }));

    screen.getByText(D.drag);
    expect(screen.queryByText("rapport.pdf")).toBeNull();
  });

  it("shows the already attached file instead of the drop zone when editing", () => {
    renderEdition({ id: "d1", url: "http://bauhaus/document/rapport.pdf" });

    screen.getByText("http://bauhaus/document/rapport.pdf");
    expect(screen.queryByText(D.drag)).toBeNull();
  });
});
