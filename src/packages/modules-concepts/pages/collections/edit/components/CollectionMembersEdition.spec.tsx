import { fireEvent, render, screen, within } from "@testing-library/react";

import { CollectionMembersEdition as CollectionMembers } from "./CollectionMembersEdition";

const conceptList = [
  { id: "c1", label: "Concept 1" },
  { id: "c2", label: "Concept 2" },
  { id: "c3", label: "Élève" },
];

const members = [{ id: "c1", label: "Concept 1" }];

const renderComponent = (props: Partial<React.ComponentProps<typeof CollectionMembers>> = {}) => {
  const handleChange = vi.fn();
  const { container } = render(
    <CollectionMembers
      conceptList={conceptList}
      members={members}
      handleChange={handleChange}
      {...props}
    />,
  );
  const [sourceList, targetList] = screen.getAllByRole("listbox");
  const [sourceFilter, targetFilter] = screen.getAllByPlaceholderText("Label...");
  return { handleChange, container, sourceList, targetList, sourceFilter, targetFilter };
};

const optionLabels = (list: HTMLElement) =>
  within(list)
    .queryAllByRole("option")
    .map((option) => option.textContent);

describe("collection-edition-creation-members", () => {
  it("renders without crashing", () => {
    render(<CollectionMembers members={[]} conceptList={[]} handleChange={vi.fn()} />);
  });

  it("liste les concepts non membres à gauche", () => {
    const { sourceList } = renderComponent();

    expect(optionLabels(sourceList)).toEqual(["Concept 2", "Élève"]);
  });

  it("liste les membres à droite", () => {
    const { targetList } = renderComponent();

    expect(optionLabels(targetList)).toEqual(["Concept 1"]);
  });

  it("affiche le nombre de membres dans l'en-tête", () => {
    const { container } = renderComponent();

    expect(container.textContent).toContain("Collection concept members (1)");
  });

  it("ajoute le concept sélectionné aux membres", () => {
    const { handleChange, sourceList, targetList } = renderComponent();

    fireEvent.click(within(sourceList).getByRole("option", { name: "Concept 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));

    expect(handleChange).toHaveBeenCalledWith([
      { id: "c1", label: "Concept 1" },
      { id: "c2", label: "Concept 2" },
    ]);
    expect(optionLabels(targetList)).toEqual(["Concept 1", "Concept 2"]);
    expect(optionLabels(sourceList)).toEqual(["Élève"]);
  });

  it("retire le membre sélectionné", () => {
    const { handleChange, sourceList, targetList } = renderComponent();

    fireEvent.click(within(targetList).getByRole("option", { name: "Concept 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Move to Source" }));

    expect(handleChange).toHaveBeenCalledWith([]);
    expect(optionLabels(targetList)).toEqual([]);
    expect(optionLabels(sourceList)).toContain("Concept 1");
  });

  it("ajoute tous les concepts disponibles", () => {
    const { handleChange, sourceList } = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Move All to Target" }));

    expect(handleChange).toHaveBeenCalledWith([
      { id: "c1", label: "Concept 1" },
      { id: "c2", label: "Concept 2" },
      { id: "c3", label: "Élève" },
    ]);
    expect(optionLabels(sourceList)).toEqual([]);
  });

  it("retire tous les membres", () => {
    const { handleChange, targetList } = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Move All to Source" }));

    expect(handleChange).toHaveBeenCalledWith([]);
    expect(optionLabels(targetList)).toEqual([]);
  });

  it("filtre les concepts disponibles sur le libellé", () => {
    const { sourceList, sourceFilter } = renderComponent();

    fireEvent.input(sourceFilter, { target: { value: "concept" } });

    expect(optionLabels(sourceList)).toEqual(["Concept 2"]);
  });

  it("filtre sans tenir compte des accents ni de la casse", () => {
    const { sourceList, sourceFilter } = renderComponent();

    fireEvent.input(sourceFilter, { target: { value: "ELEVE" } });

    expect(optionLabels(sourceList)).toEqual(["Élève"]);
  });

  it("filtre les membres sur le libellé", () => {
    const { targetList, targetFilter } = renderComponent({
      members: [
        { id: "c1", label: "Concept 1" },
        { id: "c3", label: "Élève" },
      ],
    });

    fireEvent.input(targetFilter, { target: { value: "eleve" } });

    expect(optionLabels(targetList)).toEqual(["Élève"]);
  });

  it("filtre chaque zone indépendamment", () => {
    const { sourceList, targetList, sourceFilter } = renderComponent();

    fireEvent.input(sourceFilter, { target: { value: "eleve" } });

    expect(optionLabels(sourceList)).toEqual(["Élève"]);
    expect(optionLabels(targetList)).toEqual(["Concept 1"]);
  });

  it("ne modifie pas les membres quand on filtre", () => {
    const { handleChange, targetFilter } = renderComponent();

    fireEvent.input(targetFilter, { target: { value: "introuvable" } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("expose un champ de recherche dans chacune des deux zones", () => {
    renderComponent();

    expect(screen.getAllByPlaceholderText("Label...")).toHaveLength(2);
  });
});
