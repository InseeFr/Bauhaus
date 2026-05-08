import { fireEvent, screen } from "@testing-library/react";

import { locales } from "../../../../tests/default-values";
import { renderWithRouter } from "../../../../tests/render";
import { empty } from "../../../utils/general";
import ConceptEditionCreation, { onGeneralInformationChange } from "./home";

vi.mock("./general");

describe("concept-edition-creation", () => {
  it("should update general informations", () => {
    expect(
      onGeneralInformationChange(
        {
          state1: "state1",
          data: {
            data1: "data1",
            general: {
              general1: "general1",
              general2: "general2",
            },
          },
        },
        {
          general2: "general21",
          general3: "general3",
        },
      ),
    ).toEqual({
      state1: "state1",
      data: {
        data1: "data1",
        general: {
          general1: "general1",
          general2: "general21",
          general3: "general3",
        },
      },
    });
  });
  it("renders without crashing", () => {
    renderWithRouter(
      <ConceptEditionCreation
        id="id"
        creation={true}
        title="title"
        general={empty()}
        notes={{}}
        conceptsWithLinks={[]}
        stampList={[]}
        save={vi.fn()}
        langs={locales}
      />,
    );
  });

  describe("global error message display (#1479)", () => {
    const baseProps = {
      id: "id",
      creation: true,
      title: "title",
      general: { ...empty(), contributor: "DG75-L201" },
      notes: {},
      conceptsWithLinks: [],
      stampList: [],
      save: vi.fn(),
      setSubmitting: vi.fn(),
      maxLengthScopeNote: 1000,
      langs: locales,
    };

    it("does not show the global error message on initial render of an empty creation form", () => {
      renderWithRouter(<ConceptEditionCreation {...baseProps} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("shows the global error message only after a save attempt on an invalid form", () => {
      renderWithRouter(<ConceptEditionCreation {...baseProps} save={vi.fn()} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("does not call save when the user clicks save on an invalid form", () => {
      const save = vi.fn();
      renderWithRouter(<ConceptEditionCreation {...baseProps} save={save} />);

      fireEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

      expect(save).not.toHaveBeenCalled();
    });
  });
});
