import { fireEvent, screen, within } from "@testing-library/react";

import { renderWithRouter } from "../../../../../tests/render";
import { ConceptsToValidate } from "./ConceptsToValidate";

const concepts = [
  { id: "c1", label: "Concept sans échéance", valid: null },
  { id: "c2", label: "Concept périmé", valid: "2020-01-01" },
  { id: "c3", label: "Concept à échéance", valid: "2999-01-01" },
];

const renderComponent = (props: Partial<React.ComponentProps<typeof ConceptsToValidate>> = {}) => {
  const handleValidateConceptList = vi.fn();
  const { container } = renderWithRouter(
    <ConceptsToValidate
      concepts={concepts}
      handleValidateConceptList={handleValidateConceptList}
      {...props}
    />,
  );
  return { handleValidateConceptList, container };
};

const availableList = () => screen.getAllByRole("listbox")[0];
const toPublishList = () => screen.getAllByRole("listbox")[1];

const optionLabels = (list: HTMLElement) =>
  within(list)
    .queryAllByRole("option")
    .map((option) => option.textContent);

const pick = (label: string) => {
  fireEvent.click(within(availableList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
};

const unpick = (label: string) => {
  fireEvent.click(within(toPublishList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Source" }));
};

const publish = () => fireEvent.click(screen.getByRole("button", { name: "Publish" }));

const modal = () => screen.getByRole("dialog");

describe("concept-validation", () => {
  it("affiche le titre de la page", () => {
    renderComponent();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Publishing of the provisional concepts",
    );
  });

  it("liste à gauche les concepts publiables", () => {
    renderComponent();

    expect(optionLabels(availableList())).toEqual([
      "Concept sans échéance",
      "Concept périmé",
      "Concept à échéance",
    ]);
  });

  it("part d'une sélection vide", () => {
    const { container } = renderComponent();

    expect(optionLabels(toPublishList())).toEqual([]);
    expect(container.textContent).toContain("Concepts to publish (0)");
  });

  it("compte les concepts retenus pour publication", () => {
    const { container } = renderComponent();

    pick("Concept périmé");

    expect(optionLabels(toPublishList())).toEqual(["Concept périmé"]);
    expect(container.textContent).toContain("Concepts to publish (1)");
  });

  it("retire un concept de la sélection", () => {
    renderComponent();

    pick("Concept périmé");
    unpick("Concept périmé");

    expect(optionLabels(toPublishList())).toEqual([]);
    expect(optionLabels(availableList())).toContain("Concept périmé");
  });

  it("filtre les concepts publiables sur le libellé", () => {
    renderComponent();

    fireEvent.input(screen.getAllByPlaceholderText("Label...")[0], {
      target: { value: "sans" },
    });

    expect(optionLabels(availableList())).toEqual(["Concept sans échéance"]);
  });

  it("propose un retour vers la liste des concepts", () => {
    renderComponent();

    expect(screen.getByText("Back").closest("a")).toHaveAttribute("href", "/concepts");
  });

  it("publie directement les concepts sans date de fin de validité", () => {
    const { handleValidateConceptList } = renderComponent();

    pick("Concept sans échéance");
    publish();

    expect(handleValidateConceptList).toHaveBeenCalledWith(["c1"]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("demande confirmation avant de publier un concept ayant une date de fin de validité", () => {
    const { handleValidateConceptList } = renderComponent();

    pick("Concept périmé");
    publish();

    expect(modal()).toBeInTheDocument();
    expect(handleValidateConceptList).not.toHaveBeenCalled();
  });

  it("détaille dans la confirmation les seuls concepts ayant une date de fin de validité", () => {
    renderComponent();

    pick("Concept sans échéance");
    pick("Concept périmé");
    publish();

    const body = modal();
    expect(body).toHaveTextContent("Concept périmé");
    expect(body).not.toHaveTextContent("Concept sans échéance");
  });

  it("indique que le concept périmé n'est plus modifiable", () => {
    renderComponent();

    pick("Concept périmé");
    publish();

    expect(modal()).toHaveTextContent("vous ne pourrez plus le modifier.");
  });

  it("indique que le concept encore valide ne sera plus modifiable après sa date de fin", () => {
    renderComponent();

    pick("Concept à échéance");
    publish();

    expect(modal()).toHaveTextContent("vous ne pourrez plus le modifier après cette date.");
  });

  it("publie tous les concepts sélectionnés après confirmation", () => {
    const { handleValidateConceptList } = renderComponent();

    pick("Concept sans échéance");
    pick("Concept périmé");
    publish();
    fireEvent.click(within(modal()).getByRole("button", { name: "Publish" }));

    expect(handleValidateConceptList).toHaveBeenCalledWith(["c1", "c2"]);
  });

  it("ferme la confirmation après validation", () => {
    renderComponent();

    pick("Concept périmé");
    publish();
    fireEvent.click(within(modal()).getByRole("button", { name: "Publish" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ne publie rien quand la confirmation est annulée", () => {
    const { handleValidateConceptList } = renderComponent();

    pick("Concept périmé");
    publish();
    fireEvent.click(within(modal()).getByRole("button", { name: "Cancel" }));

    expect(handleValidateConceptList).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("avertit quand aucun concept n'est sélectionné", () => {
    const { handleValidateConceptList } = renderComponent();

    publish();

    expect(screen.getByText("Add at least one concept to publish")).toBeInTheDocument();
    expect(handleValidateConceptList).not.toHaveBeenCalled();
  });

  it("lève l'avertissement dès qu'un concept est sélectionné", () => {
    renderComponent();

    publish();
    pick("Concept périmé");

    expect(screen.queryByText("Add at least one concept to publish")).not.toBeInTheDocument();
  });
});
