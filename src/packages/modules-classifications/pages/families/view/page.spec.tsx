import { describe, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { itBehavesLikeAGeneralAndMembersViewPage } from "../../../testing/general-members-view-page.testing";
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
});
