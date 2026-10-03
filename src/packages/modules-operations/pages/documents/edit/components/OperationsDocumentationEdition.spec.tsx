import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Document } from "@model/operations/document";

import { GeneralApi } from "@sdk/general-api";

import { AppContextProvider } from "../../../../../application/app-context";
import { DOCUMENT, LINK } from "../../../../../constants/documentType";
import { OperationsDocumentationEdition } from "./OperationsDocumentationEdition";

vi.mock("@sdk/general-api", () => ({
  GeneralApi: {
    putDocument: vi.fn(),
    putLink: vi.fn(),
    putDocumentFile: vi.fn(),
  },
}));

// Référence stable : la liste est une dépendance d'effet dans le composant.
const documentsAndLinks: unknown[] = [];
vi.mock("@utils/hooks/documents", () => ({
  useDocumentsAndLinks: () => ({ data: documentsAndLinks }),
}));

const mockTranslations = vi.hoisted(
  (): Record<string, string> => ({
    "documents.drag": "Drag n drop some files here, or click to select files",
    "documents.chooseFile": "Choose a file",
    "documents.removeFile": "Remove the file",
  }),
);

// Mock partiel : `initReactI18next` doit rester réel, l'i18n du module est
// initialisé au chargement de son bootstrap.
vi.mock("react-i18next", async (importOriginal) => ({
  ...(await importOriginal()),
  useTranslation: () => ({
    t: (key: string) => mockTranslations[key] ?? key,
  }),
}));

// Le placeholder de la dropzone appelle i18next.t directement au chargement du
// module, avant que l'init des ressources i18n n'ait forcément eu lieu dans
// l'environnement de test. On ne patche que `t`, en gardant le reste (use,
// init, changeLanguage...) du singleton réel intact.
vi.mock("../../../../i18n", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../../i18n")>();
  const originalT = actual.operationsI18n.t.bind(actual.operationsI18n);
  actual.operationsI18n.t = ((key: string, ...args: unknown[]) =>
    mockTranslations[key] ??
    (originalT as unknown as (...a: unknown[]) => string)(
      key,
      ...args,
    )) as unknown as typeof actual.operationsI18n.t;
  return actual;
});

/**
 * Le bouton « Choose » de PrimeReact contient l'input file et le re-clique : sous
 * happy-dom, qui n'implémente pas le flag « click in progress », userEvent.upload
 * part en récursion infinie. On déclenche donc le change directement.
 */
const selectFile = (container: HTMLElement, file: File) =>
  fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
    target: { files: [file] },
  });

const renderEdition = (
  document: Partial<Document> = {},
  props: Partial<ComponentProps<typeof OperationsDocumentationEdition>> = {},
) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <OperationsDocumentationEdition
            document={document}
            type={DOCUMENT}
            langOptions={{ codes: [] } as any}
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

  const replaceFile = async (container: HTMLElement, file: File) => {
    await userEvent.click(
      screen.getByRole("button", {
        name: mockTranslations["documents.removeFile"],
      }),
    );
    selectFile(container, file);
    await userEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));
  };

  const replaceExistingFileWith = async (fileName: string, onSave = vi.fn()) => {
    const { container } = renderEdition(existingDocument, { onSave });
    await replaceFile(container, new File(["v2"], fileName, { type: "application/pdf" }));
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
    let uploaded: (value: string) => void = () => {};
    vi.mocked(GeneralApi.putDocumentFile).mockReturnValue(
      new Promise((resolve) => (uploaded = resolve)),
    );
    await replaceExistingFileWith("rapport-v2.pdf");

    await waitFor(() => expect(GeneralApi.putDocumentFile).toHaveBeenCalled());
    expect(GeneralApi.putDocument).not.toHaveBeenCalled();

    uploaded("file:///documents/rapport-v2.pdf");
    await waitFor(() => expect(GeneralApi.putDocument).toHaveBeenCalled());
  });

  it("saves the document with the URL returned by the upload", async () => {
    vi.mocked(GeneralApi.putDocumentFile).mockResolvedValue("file:///documents/rapport-v2.pdf");
    await replaceExistingFileWith("rapport-v2.pdf");

    await waitFor(() =>
      expect(GeneralApi.putDocument).toHaveBeenCalledWith(
        expect.objectContaining({ url: "file:///documents/rapport-v2.pdf" }),
      ),
    );
  });

  it("keeps the current URL when the new file reuses the same name", async () => {
    vi.mocked(GeneralApi.putDocumentFile).mockResolvedValue("");
    await replaceExistingFileWith("rapport.pdf");

    await waitFor(() =>
      expect(GeneralApi.putDocument).toHaveBeenCalledWith(
        expect.objectContaining({ url: "file:///documents/rapport.pdf" }),
      ),
    );
  });

  it("does not save the metadata when the upload fails", async () => {
    vi.mocked(GeneralApi.putDocumentFile).mockRejectedValue({ message: "boom" });
    const onSave = vi.fn();
    await replaceExistingFileWith("rapport-v2.pdf", onSave);

    await waitFor(() => expect(GeneralApi.putDocumentFile).toHaveBeenCalled());
    expect(GeneralApi.putDocument).not.toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });
});

describe("OperationsDocumentationEdition, validation errors returned by the server", () => {
  const existingDocument = {
    id: "d1",
    labelLg1: "Rapport",
    labelLg2: "Report",
    lang: "fr",
    updatedDate: "2026-01-01",
    url: "file:///documents/rapport.pdf",
    sims: [],
  };

  const saveRejectedWith = async (errors: { field: string; message: string }[]) => {
    vi.mocked(GeneralApi.putDocument).mockRejectedValueOnce({ status: 400, errors });
    renderEdition(existingDocument);
    await userEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));
  };

  it("displays a server field error next to its field, like a client-side error", async () => {
    await saveRejectedWith([{ field: "labelLg1", message: "Ce champ est obligatoire." }]);

    const input = await screen.findByDisplayValue("Rapport");
    await waitFor(() => expect(input).toHaveAccessibleDescription("Ce champ est obligatoire."));
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("displays in the error banner a server error on a field absent from the form", async () => {
    await saveRejectedWith([{ field: "descriptionLg1", message: "est trop long" }]);

    expect(await screen.findByText("descriptionLg1 : est trop long")).toBeInTheDocument();
  });
});

describe("OperationsDocumentationEdition, after a successful save", () => {
  const existingDocument = {
    id: "d1",
    labelLg1: "Rapport",
    labelLg2: "Report",
    lang: "fr",
    updatedDate: "2026-01-01",
    url: "file:///documents/rapport.pdf",
    sims: [],
  };

  beforeEach(() => {
    vi.mocked(GeneralApi.putDocument).mockResolvedValue("d1");
  });

  afterEach(() => {
    vi.mocked(GeneralApi.putDocument).mockReset();
  });

  it("does not show the form again while navigating back to the document", async () => {
    // Navigation is asynchronous (navigate(-1), lazily loaded route): until it completes the
    // component stays mounted and must not switch back to the form.
    renderEdition(existingDocument);

    await userEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

    await waitFor(() => expect(GeneralApi.putDocument).toHaveBeenCalled());
    await act(async () => {});
    expect(screen.queryByRole("button", { name: /Sauvegarder|Save/ })).not.toBeInTheDocument();
  });

  it("shows the form again when the hosting page keeps it on screen through onSave", async () => {
    const onSave = vi.fn();
    renderEdition(existingDocument, { onSave });

    await userEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith("d1"));
    expect(await screen.findByRole("button", { name: /Sauvegarder|Save/ })).toBeInTheDocument();
  });
});

describe("OperationsDocumentationEdition, title already used", () => {
  // Données historiques : un document et un lien peuvent porter le même id.
  const link = {
    id: "4",
    uri: "http://bauhaus/documents/page/4",
    labelLg1: "Indice de traitement",
    labelLg2: "Salary index",
    lang: "fr",
    url: "https://www.fonction-publique.gouv.fr/itb",
    sims: [],
  };
  const documentWithTheSameId = {
    id: "4",
    uri: "http://bauhaus/documents/document/4",
    labelLg1: "Note méthodologique",
    labelLg2: "Methodological note",
  };

  beforeEach(() => {
    documentsAndLinks.push(documentWithTheSameId, link);
    vi.mocked(GeneralApi.putLink).mockResolvedValue("4");
  });

  afterEach(() => {
    documentsAndLinks.length = 0;
    vi.mocked(GeneralApi.putLink).mockReset();
  });

  it("does not take its own titles for duplicates when a document shares its id", async () => {
    const onSave = vi.fn();
    renderEdition(link, { type: LINK, onSave });

    await userEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith("4"));
  });
});
