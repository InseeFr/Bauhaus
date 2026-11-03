import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { useClassification } from "../../../../hooks/useClassification";
import { ItemControls } from "./ItemControls";

vi.mock("@utils/hooks/users", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@utils/hooks/users")>()),
  usePrivileges: vi.fn(),
  useUserStamps: vi.fn(),
}));

vi.mock("../../../../hooks/useClassification", () => ({ useClassification: vi.fn() }));

/** Le gestionnaire de timbre `stamp` peut modifier les nomenclatures dont il est contributeur. */
const givenStampManager = (stamp: string) => {
  vi.mocked(usePrivileges).mockReturnValue({
    privileges: [
      {
        application: MODULES.CLASSIFICATION_CLASSIFICATION,
        privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP }],
      },
    ],
  } as any);
  vi.mocked(useUserStamps).mockReturnValue({ data: [{ stamp }] } as any);
};

const givenClassificationContributor = (contributor: string) =>
  vi.mocked(useClassification).mockReturnValue({
    classification: { general: { id: "nafr2", contributor }, levels: [] },
  } as any);

const renderControls = () =>
  render(
    <MemoryRouter>
      <ItemControls classificationId="nafr2" itemId="A" version={1} />
    </MemoryRouter>,
  );

describe("<ItemControls /> avec la stratégie STAMP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    givenClassificationContributor("http://bauhaus/organisations/insee/DG75-L201");
  });

  it("propose de modifier le poste d'une nomenclature dont le timbre est contributeur", () => {
    givenStampManager("DG75-L201");

    renderControls();

    expect(useClassification).toHaveBeenCalledWith("nafr2");
    expect(screen.getByRole("link", { name: /modifier|update/i })).toBeInTheDocument();
  });

  it("masque la modification du poste à un autre timbre", () => {
    givenStampManager("DG75-H250");

    renderControls();

    expect(screen.queryByRole("link", { name: /modifier|update/i })).toBeNull();
  });
});
