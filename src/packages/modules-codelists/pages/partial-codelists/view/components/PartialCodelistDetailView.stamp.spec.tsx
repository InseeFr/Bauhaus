import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../testing/render.testing";
import { mockCodelistPrivileges } from "../../../../testing/users.testing";
import { PartialCodelistDetailView } from "./PartialCodelistDetailView";

vi.mock("@utils/hooks/users", () => import("../../../../testing/users.testing"));

const CONTRIBUTOR = "http://bauhaus/organisations/insee/DG75-L201";

/** Le gestionnaire de timbre `stamp` peut publier, modifier et supprimer les listes partielles dont il est contributeur. */
const givenStampManager = (stamp: string) =>
  mockCodelistPrivileges(
    [
      { privilege: "PUBLISH", strategy: "STAMP" },
      { privilege: "UPDATE", strategy: "STAMP" },
      { privilege: "DELETE", strategy: "STAMP" },
    ],
    [stamp],
    "CODESLIST_PARTIALCODESLIST",
  );

const renderView = () =>
  renderWithProviders(
    <PartialCodelistDetailView
      codelist={{ id: "CL_SEXE_P", labelLg1: "Sexe", contributor: [CONTRIBUTOR] }}
      handleUpdate="/codelists/partial/CL_SEXE_P/modify"
      handleDelete={vi.fn()}
      handleBack={vi.fn()}
      updatable={true}
      deletable={true}
      modalOpened={false}
      handleYes={vi.fn()}
      handleNo={vi.fn()}
      secondLang={false}
      publishComponent={vi.fn()}
    />,
  );

describe("<PartialCodelistDetailView /> avec la stratégie STAMP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propose de publier, modifier et supprimer la liste partielle dont le timbre est contributeur", () => {
    givenStampManager("DG75-L201");

    renderView();

    screen.getByText("Publish");
    screen.getByText("Update");
    screen.getByText("Delete");
  });

  it("masque la publication, la modification et la suppression à un autre timbre", () => {
    givenStampManager("DG75-H250");

    renderView();

    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
  });
});
