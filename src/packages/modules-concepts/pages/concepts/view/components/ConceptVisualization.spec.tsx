import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AppContextProvider } from "../../../../../application/app-context";
import { ConceptVisualization } from "./ConceptVisualization";

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual<typeof import("react-i18next")>("react-i18next")),
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("./ConceptGeneral", () => ({
  ConceptGeneral: ({ concept }: any) => <div>général:{concept.prefLabelLg1}</div>,
}));
vi.mock("./ConceptLinks", () => ({
  ConceptLinks: ({ links }: any) => <div>liens:{links.length}</div>,
}));
vi.mock("../menu", () => ({
  ConceptVisualizationControls: ({ onValidate, onDelete, conceptVersion }: any) => (
    <nav>
      <span>version:{conceptVersion}</span>
      <button onClick={onValidate}>valider</button>
      <button onClick={onDelete}>supprimer</button>
    </nav>
  ),
}));
vi.mock("@components/note-visualization", () => ({
  NoteVisualization: () => <div>notes</div>,
}));
vi.mock("@components/modal-rmes/modal-rmes", () => ({
  ModalRmes: ({ isOpen, modalButtons }: any) =>
    isOpen ? (
      <dialog open>
        <p>confirmation</p>
        {modalButtons.map((button: any) => (
          <button key={button.label} onClick={button.action}>
            {button.label}
          </button>
        ))}
      </dialog>
    ) : null,
}));

const validateConcept = vi.fn();
const deleteConcept = vi.fn();

const renderConcept = (general: any = {}) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <ConceptVisualization
        id="c-1"
        links={[{ id: "c-2" }] as any}
        notes={{} as any}
        secondLang={false}
        general={{ prefLabelLg1: "Chômage", conceptVersion: "2", ...general }}
        validateConcept={validateConcept}
        deleteConcept={deleteConcept}
      />
    </AppContextProvider>,
  );

describe("ConceptVisualization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le concept, ses liens et ses notes", () => {
    renderConcept();

    expect(screen.getByText("général:Chômage")).toBeInTheDocument();
    expect(screen.getByText("liens:1")).toBeInTheDocument();
    expect(screen.getByText("notes")).toBeInTheDocument();
    expect(screen.getByText("version:2")).toBeInTheDocument();
  });

  it("valide directement un concept qui n'est pas déjà valide", async () => {
    renderConcept({ valid: undefined });

    await userEvent.click(screen.getByRole("button", { name: "valider" }));

    expect(validateConcept).toHaveBeenCalledWith("c-1");
    expect(screen.queryByText("confirmation")).not.toBeInTheDocument();
  });

  it("demande confirmation avant de revalider un concept déjà valide", async () => {
    renderConcept({ valid: "2026-01-01" });

    await userEvent.click(screen.getByRole("button", { name: "valider" }));

    expect(screen.getByText("confirmation")).toBeInTheDocument();
    expect(validateConcept).not.toHaveBeenCalled();
  });

  it("valide après confirmation, et referme la modale", async () => {
    renderConcept({ valid: "2026-01-01" });
    await userEvent.click(screen.getByRole("button", { name: "valider" }));

    await userEvent.click(screen.getByRole("button", { name: "common.btnValid" }));

    expect(validateConcept).toHaveBeenCalledWith("c-1");
    expect(screen.queryByText("confirmation")).not.toBeInTheDocument();
  });

  it("annule sans rien valider", async () => {
    renderConcept({ valid: "2026-01-01" });
    await userEvent.click(screen.getByRole("button", { name: "valider" }));

    await userEvent.click(screen.getByRole("button", { name: "common.btnCancel" }));

    expect(validateConcept).not.toHaveBeenCalled();
    expect(screen.queryByText("confirmation")).not.toBeInTheDocument();
  });

  it("supprime le concept", async () => {
    renderConcept();

    await userEvent.click(screen.getByRole("button", { name: "supprimer" }));

    expect(deleteConcept).toHaveBeenCalledWith("c-1");
  });

  it("affiche l'erreur serveur quand il y en a une", () => {
    render(
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        <ConceptVisualization
          id="c-1"
          links={[]}
          notes={{} as any}
          secondLang={false}
          serverSideError="Suppression impossible"
          general={{ prefLabelLg1: "Chômage" } as any}
          validateConcept={validateConcept}
          deleteConcept={deleteConcept}
        />
      </AppContextProvider>,
    );

    expect(screen.getByText("Suppression impossible")).toBeInTheDocument();
  });
});
