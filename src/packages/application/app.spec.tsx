import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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

const hrefsIn = (row: HTMLElement) =>
  within(row)
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));

describe("<App />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing", () => {
    givenModules(
      [openModule("analytics"), openModule("admin"), openModule("users")],
      () => false,
      {},
    );

    renderApp();

    expect(screen.queryByText("analytics")).not.toBeInTheDocument();
    expect(screen.queryByText("admin")).not.toBeInTheDocument();
    expect(screen.queryByText("users")).not.toBeInTheDocument();
  });

  it("renders modules the user has access to", () => {
    givenModules(
      [openModule("analytics"), openModule("admin"), openModule("users")],
      (module: string) => ["analytics", "admin"].includes(module),
      { privileges: ["admin"] },
    );

    renderApp();

    expect(screen.getByText("analytics")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();

    expect(screen.queryByText("users")).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: /analytics/i })).toHaveAttribute("href", "/analytics");
    expect(screen.getByRole("link", { name: /admin/i })).toHaveAttribute("href", "/admin");
  });

  it("groups the tiles in a navigation landmark named after the modules", () => {
    givenModules([openModule("concepts"), openModule("structures")], () => true);

    renderApp();

    const navigation = screen.getByRole("navigation", { name: "Modules" });

    expect(within(navigation).getAllByRole("link")).toHaveLength(2);
  });

  it("displays concepts, classifications, operations and ddi on the first row and the remaining ones on the second row", () => {
    givenModules(
      [
        "concepts",
        "classifications",
        "operations",
        "structures",
        "codelists",
        "datasets",
        "ddi",
      ].map(openModule),
      () => true,
    );

    renderApp();

    const [firstRow, secondRow] = screen.getAllByRole("list");

    expect(hrefsIn(firstRow)).toEqual(["/concepts", "/classifications", "/operations", "/ddi"]);
    expect(hrefsIn(secondRow)).toEqual(["/structures", "/codelists", "/datasets"]);
  });

  it("does not fill the first row with other modules when one of its modules is not accessible", () => {
    givenModules(
      [
        openModule("concepts"),
        openModule("classifications"),
        openModule("operations"),
        openModule("structures"),
        openModule("codelists"),
      ],
      (module: string) => module !== "concepts",
    );

    renderApp();

    const [firstRow, secondRow] = screen.getAllByRole("list");

    expect(hrefsIn(firstRow)).toEqual(["/classifications", "/operations"]);
    expect(hrefsIn(secondRow)).toEqual(["/structures", "/codelists"]);
  });

  it("hides the tile of a module configured with show false", () => {
    givenModules(
      [openModule("concepts"), { identifier: "ddi", show: false, directAccess: true }],
      () => true,
    );

    renderApp();

    expect(screen.queryByText("Variables")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("hides a module the user has no access to", () => {
    givenModules([openModule("concepts"), openModule("ddi")], (module: string) => module !== "ddi");

    renderApp();

    expect(screen.queryByText("Variables")).not.toBeInTheDocument();
  });

  it("does not display a second row when three modules or less are accessible", () => {
    givenModules([openModule("concepts"), openModule("classifications")], () => true);

    renderApp();

    expect(screen.getAllByRole("list")).toHaveLength(1);
  });
});
