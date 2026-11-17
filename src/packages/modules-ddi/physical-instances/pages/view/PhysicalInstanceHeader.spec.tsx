import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { PhysicalInstanceHeader } from "./PhysicalInstanceHeader";

vi.mock("react-i18next", () => import("./i18nLabel.testing"));

// On isole le header du titre (auth/privilèges) : le titre est stubé, seul le fil d'Ariane
// est sous test ici.
vi.mock("./PhysicalInstanceLabel", () => ({
  PhysicalInstanceLabel: ({ label }: { label: string }) => <h1>{label}</h1>,
}));

// Le comportement du fil d'Ariane (sélecteur de PI) est couvert par
// PhysicalInstanceBreadcrumb.spec ; ici on vérifie seulement ce que le header lui transmet.
vi.mock("./PhysicalInstanceBreadcrumb", () => ({
  PhysicalInstanceBreadcrumb: ({ group, studyUnit, physicalInstance }: any) => (
    <nav
      aria-label="breadcrumb"
      data-group-id={group?.id}
      data-study-unit-id={studyUnit?.id}
      data-group-operations-iri={group?.operationsIri}
      data-study-unit-operations-iri={studyUnit?.operationsIri}
    >
      {[group?.label, studyUnit?.label, physicalInstance.label].filter(Boolean).join(" › ")}
    </nav>
  ),
}));

const noop = vi.fn();
const physicalInstance = { agency: "fr.insee", id: "pi-1" };
const group = { agency: "fr.insee", id: "grp-1" };
const studyUnit = { agency: "fr.insee", id: "su-1" };
const groupMirroringSeries = {
  ...group,
  operationsIri: "http://id.insee.fr/operations/serie/s1001",
};
const studyUnitMirroringOperation = {
  ...studyUnit,
  operationsIri: "http://id.insee.fr/operations/operation/s2001",
};

describe("PhysicalInstanceHeader", () => {
  it("affiche le fil d'Ariane série › opération › fichier de données courant", () => {
    render(
      <PhysicalInstanceHeader
        label="Ma PI"
        onSave={noop}
        group={group}
        groupLabel="Base permanente des équipements"
        studyUnit={studyUnit}
        studyUnitLabel="Enquête emploi 2024"
        physicalInstance={physicalInstance}
      />,
    );

    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(nav).toHaveTextContent("Base permanente des équipements › Enquête emploi 2024 › Ma PI");
    // Les id servent aux liens vers la recherche avancée filtrée.
    expect(nav).toHaveAttribute("data-group-id", "grp-1");
    expect(nav).toHaveAttribute("data-study-unit-id", "su-1");
  });

  it("transmet au fil d'Ariane la série et l'opération dont les parents sont le miroir", () => {
    render(
      <PhysicalInstanceHeader
        label="Ma PI"
        onSave={noop}
        group={groupMirroringSeries}
        groupLabel="Base permanente des équipements"
        studyUnit={studyUnitMirroringOperation}
        studyUnitLabel="Enquête emploi 2024"
        physicalInstance={physicalInstance}
      />,
    );

    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(nav).toHaveAttribute(
      "data-group-operations-iri",
      "http://id.insee.fr/operations/serie/s1001",
    );
    expect(nav).toHaveAttribute(
      "data-study-unit-operations-iri",
      "http://id.insee.fr/operations/operation/s2001",
    );
  });

  it("réduit le fil d'Ariane au fichier courant quand les parents sont inconnus", () => {
    render(
      <PhysicalInstanceHeader label="Ma PI" onSave={noop} physicalInstance={physicalInstance} />,
    );

    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toHaveTextContent(/^Ma PI$/);
  });
});
