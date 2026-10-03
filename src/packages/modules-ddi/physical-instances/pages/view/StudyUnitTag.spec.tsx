import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { PhysicalInstanceSearchRow } from "../../../hooks/usePhysicalInstancesSearch";
import { StudyUnitTag } from "./StudyUnitTag";

const mockNavigate = vi.fn();
vi.mock("react-router", () => ({ useNavigate: () => mockNavigate }));

vi.mock("react-i18next", () => import("./i18nLabel.testing"));

const mockSearch = vi.fn();
vi.mock("../../../hooks/usePhysicalInstancesSearch", () => ({
  usePhysicalInstancesSearch: () => mockSearch(),
}));

// Dropdown PrimeReact → <select> natif pour piloter options / onChange en test.
vi.mock("primereact/dropdown", async () => {
  const { NativeOptions } = await import("../pages.testing");
  return {
    // `onHide` exposé via un bouton : simule la fermeture du panneau (clic à l'extérieur).
    Dropdown: ({ options, onChange, onHide, placeholder }: any) => (
      <>
        <select
          aria-label="study-unit-select"
          onChange={(e) => onChange({ value: e.target.value })}
        >
          <option value="">{placeholder}</option>
          <NativeOptions options={options} />
        </select>
        <button type="button" onClick={onHide}>
          hide-panel
        </button>
      </>
    ),
  };
});

vi.mock("primereact/tag", () => ({
  Tag: ({ value }: any) => <span>{value}</span>,
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

describe("StudyUnitTag", () => {
  const studyUnit = { agency: "fr.insee", id: "su-1" };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearch.mockReturnValue({
      data: [
        row("pi-1", "PI Un", "su-1"),
        row("pi-2", "PI Deux", "su-1"),
        row("pi-9", "Autre étude", "su-OTHER"),
      ],
    });
  });

  it("affiche d'abord le tag et pas de select", () => {
    render(<StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />);

    expect(screen.getByText(/Enquête emploi/)).toBeInTheDocument();
    expect(screen.queryByLabelText("study-unit-select")).not.toBeInTheDocument();
  });

  it("au clic sur le tag, remplace le tag par un select listant les PI de la study unit", () => {
    render(<StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />);

    fireEvent.click(screen.getByText(/Enquête emploi/));

    const select = screen.getByLabelText("study-unit-select");
    expect(select).toBeInTheDocument();
    // seules les PI de su-1 (pas su-OTHER)
    const optionLabels = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
    expect(optionLabels).toContain("PI Un");
    expect(optionLabels).toContain("PI Deux");
    expect(optionLabels).not.toContain("Autre étude");
  });

  it("n'affiche pas la PI en cours d'édition dans la liste", () => {
    render(
      <StudyUnitTag
        label="Enquête emploi"
        studyUnit={studyUnit}
        currentPhysicalInstance={{ agency: "fr.insee", id: "pi-1" }}
      />,
    );

    fireEvent.click(screen.getByText(/Enquête emploi/));

    const select = screen.getByLabelText("study-unit-select");
    const optionLabels = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
    expect(optionLabels).not.toContain("PI Un"); // pi-1 = PI courante, exclue
    expect(optionLabels).toContain("PI Deux");
  });

  it("sélectionner une PI redirige vers sa page", () => {
    render(<StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />);
    fireEvent.click(screen.getByText(/Enquête emploi/));

    fireEvent.change(screen.getByLabelText("study-unit-select"), {
      target: { value: "fr.insee/pi-2" },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/ddi/physical-instances/fr.insee/pi-2");
  });

  // Le composant reste monté d'une PI à l'autre (seul le paramètre de route change) : sans
  // retour au tag, la PI suivante s'affichait avec un select vide à la place de l'étude (#1523).
  it("après sélection d'une PI, réaffiche le tag", () => {
    render(<StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />);
    fireEvent.click(screen.getByText(/Enquête emploi/));

    fireEvent.change(screen.getByLabelText("study-unit-select"), {
      target: { value: "fr.insee/pi-2" },
    });

    expect(screen.queryByLabelText("study-unit-select")).not.toBeInTheDocument();
    expect(screen.getByText(/Enquête emploi/)).toBeInTheDocument();
  });

  it("la fermeture du panneau (clic à l'extérieur) réaffiche le tag", () => {
    render(<StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />);
    fireEvent.click(screen.getByText(/Enquête emploi/));

    fireEvent.click(screen.getByText("hide-panel"));

    expect(screen.queryByLabelText("study-unit-select")).not.toBeInTheDocument();
    expect(screen.getByText(/Enquête emploi/)).toBeInTheDocument();
  });

  // Le panneau ouvert d'office au montage ne finit jamais sa transition : PrimeReact n'arme
  // alors pas son écouteur de clic extérieur. On ne peut pas compter sur son `onHide` (#1523).
  it("un clic en dehors du select réaffiche le tag, sans passer par PrimeReact", () => {
    render(
      <>
        <p>ailleurs</p>
        <StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />
      </>,
    );
    fireEvent.click(screen.getByText(/Enquête emploi/));

    fireEvent.mouseDown(screen.getByText("ailleurs"));

    expect(screen.queryByLabelText("study-unit-select")).not.toBeInTheDocument();
    expect(screen.getByText(/Enquête emploi/)).toBeInTheDocument();
  });

  it("un clic dans le select le laisse ouvert", () => {
    render(<StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />);
    fireEvent.click(screen.getByText(/Enquête emploi/));

    fireEvent.mouseDown(screen.getByLabelText("study-unit-select"));

    expect(screen.getByLabelText("study-unit-select")).toBeInTheDocument();
  });

  it("Échap referme le select et réaffiche le tag", () => {
    render(<StudyUnitTag label="Enquête emploi" studyUnit={studyUnit} />);
    fireEvent.click(screen.getByText(/Enquête emploi/));
    expect(screen.getByLabelText("study-unit-select")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByLabelText("study-unit-select")).not.toBeInTheDocument();
    expect(screen.getByText(/Enquête emploi/)).toBeInTheDocument();
  });
});
