import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PhysicalInstanceHeader } from "./PhysicalInstanceHeader";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts?.label ? `${key}:${opts.label}` : key,
  }),
}));

// On isole le header du titre (auth/privilèges) : le titre est stubé, seuls les tags
// « groupe » / « étude » sont sous test ici.
vi.mock("./PhysicalInstanceLabel", () => ({
  PhysicalInstanceLabel: ({ label }: { label: string }) => <h1>{label}</h1>,
}));

// Le comportement tag ↔ select de l'étude est couvert par StudyUnitTag.spec ; ici on
// vérifie seulement que le header le compose avec le bon libellé.
vi.mock("./StudyUnitTag", () => ({
  StudyUnitTag: ({ label }: { label: string }) => <span className="p-tag">{label}</span>,
}));

const noop = vi.fn();

describe("PhysicalInstanceHeader", () => {
  // Les tags parents sont masqués temporairement dans PhysicalInstanceHeader
  // (`{false && (groupLabel || studyUnitLabel)}`). À réactiver en même temps que ce flag.
  it.skip("affiche un tag avec le libellé du groupe et un tag avec le libellé de l'étude", () => {
    render(
      <PhysicalInstanceHeader
        label="Ma PI"
        onSave={noop}
        group={{ agency: "fr.insee", id: "grp-1" }}
        groupLabel="Base permanente des équipements"
        studyUnit={{ agency: "fr.insee", id: "su-1" }}
        studyUnitLabel="Enquête emploi 2024"
      />,
    );

    expect(screen.getByText(/Base permanente des équipements/)).toBeInTheDocument();
    expect(screen.getByText(/Enquête emploi 2024/)).toBeInTheDocument();
  });

  it("n'affiche aucun tag quand les libellés parents sont absents", () => {
    const { container } = render(<PhysicalInstanceHeader label="Ma PI" onSave={noop} />);

    expect(container.querySelector(".p-tag")).toBeNull();
  });
});
