import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges } from "@utils/hooks/users";

import { hasAccessToModule } from "../auth/components/auth";
import App from "./app";
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

// Mock translations
vi.mock("../deprecated-locales", () => ({
  default: {
    analyticsTitle: "Analytics",
    adminTitle: "Administration",
    ddiTitle: "Variables",
    modulesNavigationTitle: "Modules",
  },
}));

/* La configuration d'un module porte deux drapeaux ; la plupart des cas ne s'intéressent
   qu'à sa présence, d'où ce raccourci pour un module pleinement ouvert. */
const openModule = (identifier: string) => ({ identifier, show: true, directAccess: true });

describe("<App />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing", () => {
    (usePrivileges as any).mockReturnValue({});
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [openModule("analytics"), openModule("admin"), openModule("users")],
      },
    });

    (hasAccessToModule as any).mockImplementation(() => false);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
    expect(screen.queryByText("Administration")).not.toBeInTheDocument();
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
  });

  it("renders modules the user has access to", () => {
    (usePrivileges as any).mockReturnValue({ privileges: ["admin"] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [openModule("analytics"), openModule("admin"), openModule("users")],
      },
    });

    (hasAccessToModule as any).mockImplementation((module: string) =>
      ["analytics", "admin"].includes(module),
    );

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Administration")).toBeInTheDocument();

    expect(screen.queryByText("Users")).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: /analytics/i })).toHaveAttribute("href", "/analytics");
    expect(screen.getByRole("link", { name: /administration/i })).toHaveAttribute("href", "/admin");
  });

  it("groups the tiles in a navigation landmark named after the modules", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [openModule("concepts"), openModule("structures")],
      },
    });

    (hasAccessToModule as any).mockImplementation(() => true);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const navigation = screen.getByRole("navigation", { name: "Modules" });

    expect(within(navigation).getAllByRole("link")).toHaveLength(2);
  });

  it("displays concepts, classifications, operations and ddi on the first row and the remaining ones on the second row", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [
          "concepts",
          "classifications",
          "operations",
          "structures",
          "codelists",
          "datasets",
          "ddi",
        ].map(openModule),
      },
    });

    (hasAccessToModule as any).mockImplementation(() => true);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const [firstRow, secondRow] = screen.getAllByRole("list");

    expect(
      within(firstRow)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/concepts", "/classifications", "/operations", "/ddi"]);
    expect(
      within(secondRow)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/structures", "/codelists", "/datasets"]);
  });

  it("does not fill the first row with other modules when one of its modules is not accessible", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [
          openModule("concepts"),
          openModule("classifications"),
          openModule("operations"),
          openModule("structures"),
          openModule("codelists"),
        ],
      },
    });

    (hasAccessToModule as any).mockImplementation((module: string) => module !== "concepts");

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const [firstRow, secondRow] = screen.getAllByRole("list");

    expect(
      within(firstRow)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/classifications", "/operations"]);
    expect(
      within(secondRow)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/structures", "/codelists"]);
  });

  it("hides the tile of a module configured with show false", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [openModule("concepts"), { identifier: "ddi", show: false, directAccess: true }],
      },
    });

    (hasAccessToModule as any).mockImplementation(() => true);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Variables")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("hides a module the user has no access to", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [openModule("concepts"), openModule("ddi")],
      },
    });

    (hasAccessToModule as any).mockImplementation((module: string) => module !== "ddi");

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Variables")).not.toBeInTheDocument();
  });

  it("does not display a second row when three modules or less are accessible", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [openModule("concepts"), openModule("classifications")],
      },
    });

    (hasAccessToModule as any).mockImplementation(() => true);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("list")).toHaveLength(1);
  });
});
