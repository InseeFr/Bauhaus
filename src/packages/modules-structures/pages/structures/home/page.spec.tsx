import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StructureApi } from "@sdk/index";

import { renderWithQuery } from "../../../../tests/render-with-query.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { Component } from "./page";

vi.mock("@sdk/index", () => ({ StructureApi: { getStructures: vi.fn() } }));

vi.mock("@components/searchable-list", () => ({
  SearchableList: ({ items }: { items: { id: string; labelLg1: string }[] }) => (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.labelLg1}</li>
      ))}
    </ul>
  ),
}));
vi.mock("./menu", () => ({ HomePageMenu: () => <nav /> }));

describe("Structures home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StructureApi.getStructures).mockResolvedValue([
      { id: "dsd1", labelLg1: "Structure 1" },
      { id: "dsd2", labelLg1: "Structure 2" },
    ]);
  });

  it("waits for the structures before showing the list", async () => {
    vi.mocked(StructureApi.getStructures).mockReturnValue(new Promise(() => undefined));

    renderWithQuery(<Component />);

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("lists the structures", async () => {
    renderWithQuery(<Component />);

    expect(await screen.findByText("Structure 1")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("shows the module error when the structures cannot be loaded", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(StructureApi.getStructures).mockRejectedValue(sdkRejection.emptyBody(500));

    renderWithQuery(<Component />);

    expect(await screen.findByText("An error has occurred")).toBeInTheDocument();
  });
});
