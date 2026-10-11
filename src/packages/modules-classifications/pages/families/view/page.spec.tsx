import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { itBehavesLikeAGeneralAndMembersViewPage } from "../../../testing/general-members-view-page.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getFamilyGeneral: vi.fn(), getFamilyMembers: vi.fn() },
}));

vi.mock("./components/FamilyVisualization", async () => ({
  FamilyVisualization: (
    await import("../../../testing/general-members-view-page.testing")
  ).mockGeneralMembersVisualization("family"),
}));

describe("Classifications families view page", () => {
  itBehavesLikeAGeneralAndMembersViewPage({
    page: <Component />,
    getGeneral: vi.mocked(ClassificationsApi.getFamilyGeneral),
    getMembers: vi.mocked(ClassificationsApi.getFamilyMembers),
    id: "fam-1",
    label: "Famille NAF",
  });

  it("indique que la famille est introuvable au lieu de charger indéfiniment", async () => {
    vi.mocked(ClassificationsApi.getFamilyGeneral).mockRejectedValue(sdkRejection.emptyBody(404));

    renderClassificationsPage(<Component />);

    await expectItemNotFound();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  it("indique que la famille n'a pas pu être chargée quand ses membres échouent", async () => {
    vi.mocked(ClassificationsApi.getFamilyMembers).mockRejectedValue(sdkRejection.emptyBody(500));

    renderClassificationsPage(<Component />);

    await expectItemLoadFailed();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
});
