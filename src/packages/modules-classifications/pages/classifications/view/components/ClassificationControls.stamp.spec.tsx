import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { Classification } from "../../../../types";
import { ClassificationControls } from "./ClassificationControls";

vi.mock("@utils/hooks/users", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@utils/hooks/users")>()),
  usePrivileges: vi.fn(),
  useUserStamps: vi.fn(),
}));

const CONTRIBUTOR = "http://bauhaus/organisations/insee/DG75-L201";

/** Le gestionnaire de timbre `stamp` peut modifier et publier les nomenclatures dont il est contributeur. */
const givenStampManager = (stamp: string) => {
  vi.mocked(usePrivileges).mockReturnValue({
    privileges: [
      {
        application: MODULES.CLASSIFICATION_CLASSIFICATION,
        privileges: [
          { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP },
          { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.STAMP },
        ],
      },
    ],
  } as any);
  vi.mocked(useUserStamps).mockReturnValue({ data: [{ stamp }] } as any);
};

const renderControls = (contributor: Classification["contributor"]) => {
  const classification = { id: "nafr2", contributor } as Classification;
  return render(
    <MemoryRouter>
      <ClassificationControls classification={classification} publish={vi.fn()} />
    </MemoryRouter>,
  );
};

describe("<ClassificationControls /> avec la stratégie STAMP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propose de modifier et publier la nomenclature dont le timbre est contributeur", () => {
    givenStampManager("DG75-L201");

    renderControls(CONTRIBUTOR);

    expect(screen.getByRole("link", { name: /modifier|update/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /publier|publish/i })).toBeInTheDocument();
  });

  it("masque la modification et la publication à un autre timbre", () => {
    givenStampManager("DG75-H250");

    renderControls(CONTRIBUTOR);

    expect(screen.queryByRole("link", { name: /modifier|update/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /publier|publish/i })).toBeNull();
  });
});
