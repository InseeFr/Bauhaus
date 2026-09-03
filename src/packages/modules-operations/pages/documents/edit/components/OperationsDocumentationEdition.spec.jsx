import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GeneralApi } from "@sdk/general-api";

import { AppContextProvider } from "../../../../../application/app-context";
import { DOCUMENT } from "../../../../constants/documentType";
import { OperationsDocumentationEdition } from "./OperationsDocumentationEdition";

vi.mock("@sdk/general-api", () => ({
  GeneralApi: {
    putDocument: vi.fn(),
    putDocumentFile: vi.fn(),
  },
}));

// Référence stable : la liste est une dépendance d'effet dans le composant.
const documentsAndLinks = [];
vi.mock("@utils/hooks/documents", () => ({
  useDocumentsAndLinks: () => ({ data: documentsAndLinks }),
}));

const mockTranslations = vi.hoisted(() => ({
  "documents.drag": "Drag n drop some files here, or click to select files",
  "documents.chooseFile": "Choose a file",
  "documents.removeFile": "Remove the file",
}));

// Mock partiel : `initReactI18next` doit rester réel, l'i18n du module est
// initialisé au chargement de son bootstrap.
vi.mock("react-i18next", async (importOriginal) => ({
  ...(await importOriginal()),
  useTranslation: () => ({
    t: (key) => mockTranslations[key] ?? key,
  }),
}));

// Le placeholder de la dropzone appelle i18next.t directement au chargement du
// module, avant que l'init des ressources i18n n'ait forcément eu lieu dans
// l'environnement de test. On ne patche que `t`, en gardant le reste (use,
// init, changeLanguage...) du singleton réel intact.
vi.mock("../../../../i18n", async (importOriginal) => {
  const actual = await importOriginal();
  const originalT = actual.default.t.bind(actual.default);
  actual.default.t = (key, ...args) => mockTranslations[key] ?? originalT(key, ...args);
  return actual;
});

/**
 * Le bouton « Choose » de PrimeReact contient l'input file et le re-clique : sous
 * happy-dom, qui n'implémente pas le flag « click in progress », userEvent.upload
 * part en récursion infinie. On déclenche donc le change directement.
 */
const selectFile = (container, file) =>
  fireEvent.change(container.querySelector('input[type="file"]'), {
    target: { files: [file] },
  });

const renderEdition = (document = {}, props = {}) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{}}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <OperationsDocumentationEdition
            document={document}
            type={DOCUMENT}
            langOptions={{ codes: [] }}
            {...props}
          />
        </MemoryRouter>
      </QueryClientProvider>
    </AppContextProvider>,
  );

describe("OperationsDocumentationEdition, file field", () => {
  it("offers a drop zone and a button to browse when no file is attached yet", () => {
    renderEdition();

    screen.getByText(mockTranslations["documents.drag"]);
    screen.getByRole("button", {
      name: mockTranslations["documents.chooseFile"],
    });
  });

  it("replaces the drop zone by the file name once a file is selected", () => {
    const { container } = renderEdition();

    selectFile(container, new File(["content"], "rapport.pdf", { type: "application/pdf" }));

    screen.getByText("rapport.pdf");
    expect(screen.queryByText(mockTranslations["documents.drag"])).toBeNull();
  });

  it("brings the drop zone back when the attached file is removed", async () => {
    const { container } = renderEdition();

    selectFile(container, new File(["content"], "rapport.pdf", { type: "application/pdf" }));
    await userEvent.click(
      screen.getByRole("button", {
        name: mockTranslations["documents.removeFile"],
      }),
    );

    screen.getByText(mockTranslations["documents.drag"]);
    expect(screen.queryByText("rapport.pdf")).toBeNull();
  });

  it("shows the already attached file instead of the drop zone when editing", () => {
    renderEdition({ id: "d1", url: "http://bauhaus/document/rapport.pdf" });

    screen.getByText("http://bauhaus/document/rapport.pdf");
    expect(screen.queryByText(mockTranslations["documents.drag"])).toBeNull();
  });
});

describe("OperationsDocumentationEdition, replacing the attached file", () => {
  const existingDocument = {
    id: "d1",
    labelLg1: "Rapport",
    labelLg2: "Report",
    lang: "fr",
    updatedDate: "2026-01-01",
    url: "file:///documents/rapport.pdf",
    sims: [],
  };

  const replaceFile = async (container, file) => {
    await userEvent.click(
      screen.getByRole("button", {
        name: mockTranslations["documents.removeFile"],
      }),
    );
    selectFile(container, file);
    await userEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));
  };

  beforeEach(() => {
    vi.mocked(GeneralApi.putDocument).mockResolvedValue("d1");
    vi.mocked(GeneralApi.putDocumentFile).mockResolvedValue("");
  });

  afterEach(() => {
    vi.mocked(GeneralApi.putDocument).mockReset();
    vi.mocked(GeneralApi.putDocumentFile).mockReset();
  });

  it("saves the metadata only once the new file has been uploaded", async () => {
    let uploaded;
    vi.mocked(GeneralApi.putDocumentFile).mockReturnValue(
      new Promise((resolve) => (uploaded = resolve)),
    );
    const { container } = renderEdition(existingDocument, { onSave: vi.fn() });

    await replaceFile(container, new File(["v2"], "rapport-v2.pdf", { type: "application/pdf" }));

    await waitFor(() => expect(GeneralApi.putDocumentFile).toHaveBeenCalled());
    expect(GeneralApi.putDocument).not.toHaveBeenCalled();

    uploaded("file:///documents/rapport-v2.pdf");
    await waitFor(() => expect(GeneralApi.putDocument).toHaveBeenCalled());
  });

  it("saves the document with the URL returned by the upload", async () => {
    vi.mocked(GeneralApi.putDocumentFile).mockResolvedValue("file:///documents/rapport-v2.pdf");
    const { container } = renderEdition(existingDocument, { onSave: vi.fn() });

    await replaceFile(container, new File(["v2"], "rapport-v2.pdf", { type: "application/pdf" }));

    await waitFor(() =>
      expect(GeneralApi.putDocument).toHaveBeenCalledWith(
        expect.objectContaining({ url: "file:///documents/rapport-v2.pdf" }),
      ),
    );
  });

  it("keeps the current URL when the new file reuses the same name", async () => {
    vi.mocked(GeneralApi.putDocumentFile).mockResolvedValue("");
    const { container } = renderEdition(existingDocument, { onSave: vi.fn() });

    await replaceFile(container, new File(["v2"], "rapport.pdf", { type: "application/pdf" }));

    await waitFor(() =>
      expect(GeneralApi.putDocument).toHaveBeenCalledWith(
        expect.objectContaining({ url: "file:///documents/rapport.pdf" }),
      ),
    );
  });

  it("does not save the metadata when the upload fails", async () => {
    vi.mocked(GeneralApi.putDocumentFile).mockRejectedValue({ message: "boom" });
    const onSave = vi.fn();
    const { container } = renderEdition(existingDocument, { onSave });

    await replaceFile(container, new File(["v2"], "rapport-v2.pdf", { type: "application/pdf" }));

    await waitFor(() => expect(GeneralApi.putDocumentFile).toHaveBeenCalled());
    expect(GeneralApi.putDocument).not.toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });
});
