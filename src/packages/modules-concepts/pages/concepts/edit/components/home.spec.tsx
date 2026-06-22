import { fireEvent, screen } from "@testing-library/react";

import { ConceptGeneral, ConceptNotes } from "../../../../../model/concepts/concept";
import { renderWithRouter } from "../../../../../tests/render";
import { empty } from "../../../../utils/general";
import ConceptEditionCreation, { onGeneralInformationChange } from "./home";

vi.mock("./general");

describe("concept-edition-creation", () => {
  it("should update general informations", () => {
    const initialState = {
      id: undefined,
      showModal: false,
      saveAttempted: false,
      data: {
        general: {
          general1: "general1",
          general2: "general2",
        } as unknown as ConceptGeneral,
        notes: {} as ConceptNotes,
        conceptsWithLinks: [],
        equivalentLinks: [],
      },
    };
    const result = onGeneralInformationChange(initialState, {
      general2: "general21",
      general3: "general3",
    } as unknown as Partial<ConceptGeneral>);
    expect(result.data.general).toEqual({
      general1: "general1",
      general2: "general21",
      general3: "general3",
    });
  });

  const buildBaseProps = () => ({
    id: "id",
    creation: true,
    title: "title",
    general: { ...empty(), contributor: "DG75-L201" } as unknown as ConceptGeneral,
    notes: {} as ConceptNotes,
    conceptsWithLinks: [],
    stampList: [],
    save: vi.fn(),
    setSubmitting: vi.fn(),
    submitting: false,
    maxLengthScopeNote: 1000,
  });

  it("renders without crashing", () => {
    renderWithRouter(<ConceptEditionCreation {...buildBaseProps()} />);
  });

  describe("global error message display (#1479)", () => {
    it("does not show the global error message on initial render of an empty creation form", () => {
      renderWithRouter(<ConceptEditionCreation {...buildBaseProps()} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("shows the global error message only after a save attempt on an invalid form", () => {
      renderWithRouter(<ConceptEditionCreation {...buildBaseProps()} save={vi.fn()} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("does not call save when the user clicks save on an invalid form", () => {
      const save = vi.fn();
      renderWithRouter(<ConceptEditionCreation {...buildBaseProps()} save={save} />);

      fireEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

      expect(save).not.toHaveBeenCalled();
    });
  });
});
