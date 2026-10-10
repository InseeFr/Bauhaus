import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges } from "@utils/hooks/users";

import { hasAccessToModule } from "../auth/components/auth";
import { App } from "./app";
import { useAppContext } from "./app-context";

// Mocks
vi.mock("@utils/hooks/users", () => ({
  usePrivileges: vi.fn(),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("./app-context", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("../auth/components/auth", () => ({
  hasAccessToModule: vi.fn(),
}));

/* La configuration d'un module porte deux drapeaux ; la plupart des cas ne s'intéressent
   qu'à sa présence, d'où ce raccourci pour un module pleinement ouvert. */
const openModule = (identifier: string) => ({ identifier, show: true, directAccess: true });

type ModuleConfiguration = { identifier: string; show: boolean; directAccess: boolean };

const ALL_MODULES = [
  "concepts",
  "classifications",
  "operations",
  "structures",
  "codelists",
  "datasets",
  "ddi",
];

const givenModules = (
  modules: ModuleConfiguration[],
  hasAccess: (module: string) => boolean,
  privileges: unknown = { privileges: [] },
) => {
  (usePrivileges as any).mockReturnValue(privileges);
  (useAppContext as any).mockReturnValue({ properties: { modules } });
  (hasAccessToModule as any).mockImplementation(hasAccess);
};

const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

const tilesIn = (row: HTMLElement) =>
  within(row)
    .getAllByRole("link")
    .map((link) => [link.textContent, link.getAttribute("href")]);

describe("<App />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders no tile when the user has access to no module", () => {
    givenModules(ALL_MODULES.map(openModule), () => false, {});

    renderApp();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("groups the tiles in a navigation landmark named after the modules", () => {
    givenModules([openModule("concepts"), openModule("structures")], () => true);

    renderApp();

    const navigation = screen.getByRole("navigation", { name: "Modules" });

    expect(within(navigation).getAllByRole("link")).toHaveLength(2);
  });

  it("displays concepts, operations and data description on the first row, classifications and administration on the second one", () => {
    givenModules(ALL_MODULES.map(openModule), () => true);

    renderApp();

    const [firstRow, secondRow] = screen.getAllByRole("list");

    expect(tilesIn(firstRow)).toEqual([
      ["Concepts", "/concepts"],
      ["Operations", "/operations"],
      ["Data description", "/datasets"],
    ]);
    expect(tilesIn(secondRow)).toEqual([
      ["Classifications", "/classifications"],
      ["Administration", "/codelists"],
    ]);
  });

  it("leads the data description tile to the variables when the datasets are not accessible", () => {
    givenModules([openModule("datasets"), openModule("ddi")], (module) => module === "ddi");

    renderApp();

    expect(screen.getByRole("link", { name: "Data description" })).toHaveAttribute("href", "/ddi");
  });

  it("leads the administration tile to the structures when the codelists are hidden", () => {
    givenModules(
      [{ identifier: "codelists", show: false, directAccess: true }, openModule("structures")],
      () => true,
    );

    renderApp();

    expect(screen.getByRole("link", { name: "Administration" })).toHaveAttribute(
      "href",
      "/structures",
    );
  });

  it("hides a grouping tile when none of its modules is accessible", () => {
    givenModules(
      [openModule("concepts"), openModule("codelists"), openModule("structures")],
      (module) => module === "concepts",
    );

    renderApp();

    expect(screen.queryByRole("link", { name: "Administration" })).not.toBeInTheDocument();
  });

  it("does not fill the first row with other tiles when one of its tiles is not accessible", () => {
    givenModules(ALL_MODULES.map(openModule), (module: string) => module !== "concepts");

    renderApp();

    const [firstRow, secondRow] = screen.getAllByRole("list");

    expect(tilesIn(firstRow).map(([name]) => name)).toEqual(["Operations", "Data description"]);
    expect(tilesIn(secondRow).map(([name]) => name)).toEqual(["Classifications", "Administration"]);
  });

  it("hides the tile of a module configured with show false", () => {
    givenModules(
      [openModule("concepts"), { identifier: "operations", show: false, directAccess: true }],
      () => true,
    );

    renderApp();

    expect(screen.queryByText("Operations")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("does not display a second row when only first row tiles are accessible", () => {
    givenModules([openModule("concepts"), openModule("operations")], () => true);

    renderApp();

    expect(screen.getAllByRole("list")).toHaveLength(1);
  });
});
