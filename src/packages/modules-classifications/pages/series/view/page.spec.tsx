import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { itBehavesLikeAGeneralAndMembersViewPage } from "../../../testing/general-members-view-page.testing";
import { renderClassificationsPage } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getSeriesGeneral: vi.fn(), getSeriesMembers: vi.fn() },
}));

vi.mock("./components/SeriesVisualization", async () => ({
  SeriesVisualization: (
    await import("../../../testing/general-members-view-page.testing")
  ).mockGeneralMembersVisualization("series"),
}));

describe("Classifications series view page", () => {
  itBehavesLikeAGeneralAndMembersViewPage({
    page: <Component />,
    getGeneral: vi.mocked(ClassificationsApi.getSeriesGeneral),
    getMembers: vi.mocked(ClassificationsApi.getSeriesMembers),
    id: "ser-1",
    label: "Série NAF",
  });

  it("indique que la série est introuvable au lieu de charger indéfiniment", async () => {
    vi.mocked(ClassificationsApi.getSeriesGeneral).mockRejectedValue(sdkRejection.emptyBody(404));

    renderClassificationsPage(<Component />);

    await expectItemNotFound();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  it("indique que la série n'a pas pu être chargée quand ses membres échouent", async () => {
    vi.mocked(ClassificationsApi.getSeriesMembers).mockRejectedValue(sdkRejection.emptyBody(500));

    renderClassificationsPage(<Component />);

    await expectItemLoadFailed();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
});
