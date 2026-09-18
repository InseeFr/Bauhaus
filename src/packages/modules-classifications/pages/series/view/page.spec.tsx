import { describe, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { itBehavesLikeAGeneralAndMembersViewPage } from "../../../testing/general-members-view-page.testing";
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
});
