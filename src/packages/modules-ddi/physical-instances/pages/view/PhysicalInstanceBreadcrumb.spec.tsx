import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { AppName } from "../../../../application/app-context";
import type { PhysicalInstanceSearchRow } from "../../../hooks/usePhysicalInstancesSearch";
import { PhysicalInstanceBreadcrumb } from "./PhysicalInstanceBreadcrumb";

vi.mock("react-i18next", () => import("./i18nLabel.testing"));

let mockVisibleModules: AppName[] = [];
vi.mock("../../../../application/visible-modules", () => ({
  useVisibleModules: () => mockVisibleModules,
}));

const mockSearch = vi.fn();
vi.mock("../../../hooks/usePhysicalInstancesSearch", () => ({
  usePhysicalInstancesSearch: () => mockSearch(),
}));

const row = (
  id: string,
  label: string | null,
  studyUnitId: string | null,
): PhysicalInstanceSearchRow => ({
  agency: "fr.insee",
  id,
  label,
  versionDate: null,
  studyUnitAgency: studyUnitId ? "fr.insee" : null,
  studyUnitId,
  studyUnitLabel: "Enquête emploi",
  groupAgency: null,
  groupId: null,
  groupLabel: null,
});

const CurrentPath = () => <output aria-label="current-path">{useLocation().pathname}</output>;

const group = { id: "grp-1", label: "Base permanente des équipements" };
const studyUnit = { agency: "fr.insee", id: "su-1", label: "Enquête emploi" };
const current = { agency: "fr.insee", id: "pi-1", label: "PI Un" };
const initialEntries = ["/ddi/physical-instances/fr.insee/pi-1"];

const renderBreadcrumb = (props: Partial<Parameters<typeof PhysicalInstanceBreadcrumb>[0]> = {}) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route
          path="/ddi/physical-instances/:agencyId/:id"
          element={
            <>
              <PhysicalInstanceBreadcrumb
                group={group}
                studyUnit={studyUnit}
                physicalInstance={current}
                {...props}
              />
              <CurrentPath />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

const switcherButton = () =>
  screen.getByRole("button", { name: "physicalInstance.view.breadcrumb.switch:PI Un" });

const filterBox = () =>
  screen.getByRole("searchbox", { name: "physicalInstance.view.breadcrumb.filter" });

describe("PhysicalInstanceBreadcrumb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVisibleModules = [];
    mockSearch.mockReturnValue({
      data: [
        row("pi-1", "PI Un", "su-1"),
        row("pi-2", "PI Deux", "su-1"),
        row("pi-3", null, "su-1"),
        row("pi-9", "Autre étude", "su-OTHER"),
      ],
    });
  });

  it("affiche l'arborescence série › opération › fichier de données courant", () => {
    renderBreadcrumb();

    const nav = screen.getByRole("navigation", { name: "physicalInstance.view.breadcrumb.label" });
    const items = within(nav).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("Base permanente des équipements"),
      expect.stringContaining("Enquête emploi"),
      expect.stringContaining("PI Un"),
    ]);
  });

  it("mène de la série à la recherche avancée filtrée sur cette série", () => {
    renderBreadcrumb();

    expect(screen.getByRole("link", { name: /Base permanente des équipements/ })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/search?group=grp-1",
    );
  });

  it("mène de l'opération à la recherche avancée filtrée sur sa série et cette opération", () => {
    renderBreadcrumb();

    expect(screen.getByRole("link", { name: /Enquête emploi/ })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/search?group=grp-1&studyUnit=su-1",
    );
  });

  describe("quand le module opérations est proposé à l'utilisateur", () => {
    const mirroredGroup = { ...group, operationsIri: "http://id.insee.fr/operations/serie/s1001" };
    const mirroredStudyUnit = {
      ...studyUnit,
      operationsIri: "http://id.insee.fr/operations/operation/s2001",
    };

    beforeEach(() => {
      mockVisibleModules = ["operations"];
    });

    it("mène de la série à sa page dans le module opérations", () => {
      renderBreadcrumb({ group: mirroredGroup, studyUnit: mirroredStudyUnit });

      expect(screen.getByRole("link", { name: /Base permanente des équipements/ })).toHaveAttribute(
        "href",
        "/operations/series/s1001",
      );
    });

    it("mène de l'opération à sa page dans le module opérations", () => {
      renderBreadcrumb({ group: mirroredGroup, studyUnit: mirroredStudyUnit });

      expect(screen.getByRole("link", { name: /Enquête emploi/ })).toHaveAttribute(
        "href",
        "/operations/operation/s2001",
      );
    });

    it("garde la recherche avancée pour un parent qui ne reflète aucune série ni opération", () => {
      renderBreadcrumb();

      expect(screen.getByRole("link", { name: /Base permanente des équipements/ })).toHaveAttribute(
        "href",
        "/ddi/physical-instances/search?group=grp-1",
      );
      expect(screen.getByRole("link", { name: /Enquête emploi/ })).toHaveAttribute(
        "href",
        "/ddi/physical-instances/search?group=grp-1&studyUnit=su-1",
      );
    });
  });

  it("garde la recherche avancée quand le module opérations n'est pas proposé, même pour des parents miroirs", () => {
    renderBreadcrumb({
      group: { ...group, operationsIri: "http://id.insee.fr/operations/serie/s1001" },
      studyUnit: { ...studyUnit, operationsIri: "http://id.insee.fr/operations/operation/s2001" },
    });

    expect(screen.getByRole("link", { name: /Base permanente des équipements/ })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/search?group=grp-1",
    );
    expect(screen.getByRole("link", { name: /Enquête emploi/ })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/search?group=grp-1&studyUnit=su-1",
    );
  });

  it("garde le sélecteur de fichiers fermé tant qu'on ne clique pas", () => {
    renderBreadcrumb();

    expect(switcherButton()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "PI Deux" })).not.toBeInTheDocument();
  });

  it("liste les fichiers de la même opération, le fichier courant marqué et non cliquable", () => {
    renderBreadcrumb();
    fireEvent.click(switcherButton());

    expect(switcherButton()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "PI Deux" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-2",
    );
    // Sans libellé, l'identifiant sert de libellé.
    expect(screen.getByRole("link", { name: "pi-3" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Autre étude" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /PI Un/ })).not.toBeInTheDocument();
    const currentEntry = document.querySelector("[aria-current='true']");
    expect(currentEntry).toHaveTextContent("PI Un");
  });

  it("filtre la liste sur le libellé, sans tenir compte de la casse", () => {
    renderBreadcrumb();
    fireEvent.click(switcherButton());

    fireEvent.change(filterBox(), { target: { value: "deux" } });

    expect(screen.getByRole("link", { name: "PI Deux" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "pi-3" })).not.toBeInTheDocument();
  });

  it("annonce l'absence de résultat quand le filtre ne retient rien", () => {
    renderBreadcrumb();
    fireEvent.click(switcherButton());

    fireEvent.change(filterBox(), { target: { value: "zzz" } });

    expect(screen.getByText("physicalInstance.view.breadcrumb.noMatch")).toBeInTheDocument();
  });

  it("navigue vers le fichier choisi et referme le sélecteur", () => {
    renderBreadcrumb();
    fireEvent.click(switcherButton());

    fireEvent.click(screen.getByRole("link", { name: "PI Deux" }));

    expect(screen.getByLabelText("current-path")).toHaveTextContent(
      "/ddi/physical-instances/fr.insee/pi-2",
    );
    expect(screen.queryByRole("link", { name: "PI Deux" })).not.toBeInTheDocument();
  });

  it("referme le sélecteur sur Échap et rend le focus au bouton", () => {
    renderBreadcrumb();
    fireEvent.click(switcherButton());

    fireEvent.keyDown(filterBox(), { key: "Escape" });

    expect(switcherButton()).toHaveAttribute("aria-expanded", "false");
    expect(switcherButton()).toHaveFocus();
  });

  it("referme le sélecteur sur un clic à l'extérieur", () => {
    renderBreadcrumb();
    fireEvent.click(switcherButton());

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("link", { name: "PI Deux" })).not.toBeInTheDocument();
  });

  it("affiche le fichier courant en texte simple, sans sélecteur, quand il n'a pas d'opération", () => {
    renderBreadcrumb({ group: undefined, studyUnit: undefined });

    const nav = screen.getByRole("navigation", { name: "physicalInstance.view.breadcrumb.label" });
    expect(within(nav).getByText("PI Un")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
