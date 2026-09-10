import { fireEvent, screen, within } from "@testing-library/react";

import { BROADER, CLOSE_MATCH, NARROWER, NONE, RELATED } from "@sdk/constants";

import { renderWithRouter } from "../../../../../tests/render";
import { LinksEdition as ConceptLinks } from "./LinksEdition";

const conceptsWithLinks = [
  { id: "c1", label: "Enfant", typeOfLink: NARROWER },
  { id: "c2", label: "Parent", typeOfLink: BROADER },
  { id: "c3", label: "Libre", typeOfLink: NONE },
  { id: "c4", label: "Élève", typeOfLink: NONE },
  { id: "self", label: "Concept courant", typeOfLink: NONE },
];

const renderComponent = (props: Partial<React.ComponentProps<typeof ConceptLinks>> = {}) => {
  const handleChange = vi.fn();
  const handleChangeEquivalentLinks = vi.fn();
  const { container } = renderWithRouter(
    <ConceptLinks
      conceptsWithLinks={conceptsWithLinks}
      currentId="self"
      handleChange={handleChange}
      equivalentLinks={[]}
      handleChangeEquivalentLinks={handleChangeEquivalentLinks}
      activeLinkType={NARROWER}
      {...props}
    />,
  );
  return { handleChange, handleChangeEquivalentLinks, container };
};

const availableList = () => screen.getAllByRole("listbox")[0];
const linkedList = () => screen.getAllByRole("listbox")[1];

const optionLabels = (list: HTMLElement) =>
  within(list)
    .queryAllByRole("option")
    .map((option) => option.textContent);

const link = (label: string) => {
  fireEvent.click(within(availableList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
};

const unlink = (label: string) => {
  fireEvent.click(within(linkedList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Source" }));
};

const filterAvailable = (label: string) =>
  fireEvent.input(screen.getAllByPlaceholderText("Label...")[0], { target: { value: label } });

describe("concept-edition-creation-links", () => {
  it("n'imbrique plus la saisie des liens dans des onglets", () => {
    renderComponent();

    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });

  it("liste à droite les concepts déjà liés du type demandé", () => {
    renderComponent();

    expect(optionLabels(linkedList())).toEqual(["Enfant"]);
  });

  it("change de liste de liens quand le type demandé change", () => {
    renderComponent({ activeLinkType: BROADER });

    expect(optionLabels(linkedList())).toEqual(["Parent"]);
  });

  it("propose à gauche les concepts encore non liés", () => {
    renderComponent();

    expect(optionLabels(availableList())).toEqual(["Libre", "Élève"]);
  });

  it("exclut le concept courant des concepts proposés", () => {
    renderComponent();

    expect(optionLabels(availableList())).not.toContain("Concept courant");
  });

  it("ne propose pas les concepts déjà liés par un autre type", () => {
    renderComponent();

    expect(optionLabels(availableList())).not.toContain("Parent");
  });

  it("compte les concepts liés dans l'en-tête", () => {
    const { container } = renderComponent();

    expect(container.textContent).toContain("A pour enfant (1)");
  });

  it("filtre les concepts proposés sur le libellé, sans tenir compte des accents ni de la casse", () => {
    renderComponent();

    filterAvailable("ELEVE");

    expect(optionLabels(availableList())).toEqual(["Élève"]);
  });

  it("lie un concept avec le type demandé", () => {
    const { handleChange } = renderComponent();

    link("Libre");

    expect(handleChange).toHaveBeenCalledWith([
      { id: "c1", label: "Enfant", typeOfLink: NARROWER },
      { id: "c2", label: "Parent", typeOfLink: BROADER },
      { id: "c3", label: "Libre", typeOfLink: NARROWER },
      { id: "c4", label: "Élève", typeOfLink: NONE },
    ]);
  });

  it("lie un concept avec le type sélectionné dans le sommaire", () => {
    const { handleChange } = renderComponent({ activeLinkType: RELATED });

    link("Libre");

    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([{ id: "c3", label: "Libre", typeOfLink: RELATED }]),
    );
  });

  it("fait passer le concept lié dans la liste des liens", () => {
    renderComponent();

    link("Libre");

    expect(optionLabels(linkedList())).toEqual(["Enfant", "Libre"]);
    expect(optionLabels(availableList())).toEqual(["Élève"]);
  });

  it("délie un concept déjà lié", () => {
    const { handleChange } = renderComponent();

    unlink("Enfant");

    expect(handleChange).toHaveBeenCalledWith([
      { id: "c1", label: "Enfant", typeOfLink: NONE },
      { id: "c2", label: "Parent", typeOfLink: BROADER },
      { id: "c3", label: "Libre", typeOfLink: NONE },
      { id: "c4", label: "Élève", typeOfLink: NONE },
    ]);
  });

  it("fait repasser le concept délié dans les concepts proposés", () => {
    renderComponent();

    unlink("Enfant");

    expect(optionLabels(linkedList())).toEqual([]);
    expect(optionLabels(availableList())).toEqual(["Enfant", "Libre", "Élève"]);
  });

  it("laisse intacts les liens d'un autre type quand on délie tout", () => {
    const { handleChange } = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Move All to Source" }));

    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([{ id: "c2", label: "Parent", typeOfLink: BROADER }]),
    );
  });

  it("affiche la saisie des liens équivalents quand ce type est demandé", () => {
    renderComponent({ activeLinkType: CLOSE_MATCH });

    expect(screen.getByPlaceholderText("New link")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("n'autorise pas l'ajout d'un lien équivalent tant que la saisie est vide", () => {
    renderComponent({ activeLinkType: CLOSE_MATCH });

    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("n'autorise pas l'ajout d'un lien équivalent réduit à des espaces", () => {
    renderComponent({ activeLinkType: CLOSE_MATCH });
    fireEvent.change(screen.getByPlaceholderText("New link"), { target: { value: "   " } });

    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("autorise l'ajout dès qu'un lien équivalent est saisi", () => {
    renderComponent({ activeLinkType: CLOSE_MATCH });
    fireEvent.change(screen.getByPlaceholderText("New link"), {
      target: { value: "urn:concept:42" },
    });

    expect(screen.getByRole("button", { name: "Add" })).toBeEnabled();
  });

  it("réinterdit l'ajout une fois le lien équivalent ajouté", () => {
    renderComponent({ activeLinkType: CLOSE_MATCH });
    fireEvent.change(screen.getByPlaceholderText("New link"), {
      target: { value: "urn:concept:42" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("remonte l'ajout d'un lien équivalent", () => {
    const { handleChangeEquivalentLinks } = renderComponent({ activeLinkType: CLOSE_MATCH });
    fireEvent.change(screen.getByPlaceholderText("New link"), {
      target: { value: "urn:concept:42" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(handleChangeEquivalentLinks).toHaveBeenCalledWith([
      expect.objectContaining({ urn: "urn:concept:42" }),
    ]);
  });

  it("affiche les liens équivalents existants", () => {
    renderComponent({
      activeLinkType: CLOSE_MATCH,
      equivalentLinks: [{ urn: "urn:concept:7" } as never],
    });

    expect(screen.getByText("urn:concept:7")).toBeInTheDocument();
  });
});
