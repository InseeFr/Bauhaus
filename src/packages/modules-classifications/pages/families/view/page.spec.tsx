import { QueryClient } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClassificationsApi } from "@sdk/classification";

import { renderWithQuery } from "../../../../tests/render-with-query.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { familyGeneralQuery, familyMembersQuery } from "../../../hooks/useClassificationFamily";
import { Component, prefetchFamily } from "./page";

vi.mock("@sdk/classification", () => ({
  ClassificationsApi: { getFamilyGeneral: vi.fn(), getFamilyMembers: vi.fn() },
}));

vi.mock("./components/FamilyVisualization", async () => ({
  FamilyVisualization: (
    await import("../../../testing/general-members-view-page.testing")
  ).mockGeneralMembersVisualization("family"),
}));

const renderFamily = (id = "fam-1") =>
  renderWithQuery(<Component />, { path: "/family/:id", route: `/family/${id}` });

describe("Classifications families view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ClassificationsApi.getFamilyGeneral).mockResolvedValue({
      prefLabelLg1: "Famille NAF",
    });
    vi.mocked(ClassificationsApi.getFamilyMembers).mockResolvedValue([
      { id: "m-1", labelLg1: "Membre 1" },
      { id: "m-2", labelLg1: "Membre 2" },
    ]);
  });

  it("waits for the general and the members of the family before showing it", async () => {
    let resolve: (members: unknown) => void = () => undefined;
    const members = new Promise((settle) => {
      resolve = settle;
    });
    vi.mocked(ClassificationsApi.getFamilyMembers).mockReturnValue(members);

    renderFamily();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("libellé:Famille NAF")).not.toBeInTheDocument();
    resolve([
      { id: "m-1", labelLg1: "Membre 1" },
      { id: "m-2", labelLg1: "Membre 2" },
    ]);
    expect(await screen.findByText("libellé:Famille NAF")).toBeInTheDocument();
    expect(screen.getByText("membres:2")).toBeInTheDocument();
    expect(ClassificationsApi.getFamilyGeneral).toHaveBeenCalledWith("fam-1");
    expect(ClassificationsApi.getFamilyMembers).toHaveBeenCalledWith("fam-1");
  });

  it("asks for the general and the members at the same time", async () => {
    vi.mocked(ClassificationsApi.getFamilyGeneral).mockReturnValue(new Promise(() => undefined));

    renderFamily();

    await screen.findByRole("status");
    expect(ClassificationsApi.getFamilyMembers).toHaveBeenCalledWith("fam-1");
  });

  it("tolerates an empty answer on both sides", async () => {
    vi.mocked(ClassificationsApi.getFamilyGeneral).mockResolvedValue(undefined);
    vi.mocked(ClassificationsApi.getFamilyMembers).mockResolvedValue(undefined);

    renderFamily();

    expect(await screen.findByText("membres:0")).toBeInTheDocument();
    expect(screen.getByText("libellé:(aucun)")).toBeInTheDocument();
  });

  it("passes the second language state to the view", async () => {
    renderFamily();

    expect(await screen.findByText("secondeLangue:false")).toBeInTheDocument();
  });

  it("shows the module error when the members cannot be loaded", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(ClassificationsApi.getFamilyMembers).mockRejectedValue(sdkRejection.emptyBody(500));

    renderFamily();

    expect(await screen.findByText("An error has occurred")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("shows the family straight away when it was read less than a minute ago", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(familyGeneralQuery("fam-1").queryKey, { prefLabelLg1: "En cache" });
    queryClient.setQueryData(familyMembersQuery("fam-1").queryKey, []);

    renderWithQuery(<Component />, { path: "/family/:id", route: "/family/fam-1", queryClient });

    expect(await screen.findByText("libellé:En cache")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(ClassificationsApi.getFamilyGeneral).not.toHaveBeenCalled();
  });

  it("starts reading the family from the route loader, before the page renders", async () => {
    const queryClient = new QueryClient();

    prefetchFamily(queryClient)({ params: { id: "fam-1" } } as any);

    await vi.waitFor(() =>
      expect(queryClient.getQueryData(familyGeneralQuery("fam-1").queryKey)).toEqual({
        prefLabelLg1: "Famille NAF",
      }),
    );
    await vi.waitFor(() =>
      expect(queryClient.getQueryData(familyMembersQuery("fam-1").queryKey)).toHaveLength(2),
    );
  });

  it("does not hold the navigation back while the family is read", () => {
    vi.mocked(ClassificationsApi.getFamilyGeneral).mockReturnValue(new Promise(() => undefined));

    expect(prefetchFamily(new QueryClient())({ params: { id: "fam-1" } } as any)).toBeNull();
  });
});
