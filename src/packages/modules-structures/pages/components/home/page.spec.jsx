import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { StructureApi } from "@sdk/index";

import { MUTUALIZED_COMPONENT_TYPES } from "../../../constants";
import { Component } from "./page";

const navigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}));

// Le module structures initialise sa propre instance i18next au chargement : on ne
// remplace que useTranslation, sinon initReactI18next disparaît et l'import échoue.
vi.mock("react-i18next", async () => ({
  ...(await vi.importActual("react-i18next")),
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("@sdk/index", () => ({ StructureApi: { getMutualizedComponents: vi.fn() } }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("@components/filter-toggle-buttons", () => ({
  default: ({ currentValue, handleSelection, options }) => (
    <div>
      <span>filtre:{currentValue}</span>
      {options.map(([value, label]) => (
        <button key={value} onClick={() => handleSelection(value)}>
          {label}
        </button>
      ))}
    </div>
  ),
}));
vi.mock("@components/searchable-list", () => ({
  SearchableList: ({ items }) => (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.labelLg1}
          {Object.hasOwn(item, "type") ? "|type conservé" : ""}
        </li>
      ))}
    </ul>
  ),
}));
vi.mock("./menu", () => ({ HomePageMenu: ({ filter }) => <nav>menu:{filter}</nav> }));

// Les types sont des IRI QB, et les libellés des boutons viennent d'i18next : on part des
// constantes réelles plutôt que d'inventer des valeurs qui ne filtreraient rien.
const [firstType, secondType] = MUTUALIZED_COMPONENT_TYPES;

const components = [
  { id: "c-1", labelLg1: "Premier", labelLg2: "First", type: firstType.value },
  { id: "c-2", labelLg1: "Second", labelLg2: "Second EN", type: secondType.value },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );

describe("Mutualized components home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(StructureApi.getMutualizedComponents).mockResolvedValue(components);
  });

  it("affiche toutes les composantes par défaut", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
    expect(screen.getByText("filtre:ALL")).toBeInTheDocument();
  });

  it("ne transmet à la liste que l'identifiant et les libellés", async () => {
    renderPage();

    await waitFor(() => expect(screen.getByText("Premier")).toBeInTheDocument());
    expect(screen.queryByText(/type conservé/)).not.toBeInTheDocument();
  });

  it("filtre par type et remet la pagination à la première page", async () => {
    renderPage();
    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));

    await userEvent.click(screen.getByRole("button", { name: secondType.labelPlural }));

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(1));
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining("?page=1"));
  });

  it("mémorise le filtre choisi pour la prochaine visite", async () => {
    renderPage();
    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));

    await userEvent.click(screen.getByRole("button", { name: secondType.labelPlural }));

    await waitFor(() =>
      expect(sessionStorage.getItem("components-displayMode")).toBe(secondType.value),
    );
  });

  it("repart du filtre mémorisé", async () => {
    sessionStorage.setItem("components-displayMode", firstType.value);
    renderPage();

    await waitFor(() => expect(screen.getByText(`filtre:${firstType.value}`)).toBeInTheDocument());
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Premier")).toBeInTheDocument();
  });
});
