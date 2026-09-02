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
    moduleUnavailable: "Module indisponible pour le moment",
  },
}));

describe("<App />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing", () => {
    (usePrivileges as any).mockReturnValue({});
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [
          { identifier: "analytics", disabled: false },
          { identifier: "admin", disabled: false },
          { identifier: "users", disabled: false },
        ],
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
        modules: [
          { identifier: "analytics", disabled: false },
          { identifier: "admin", disabled: false },
          { identifier: "users", disabled: false },
        ],
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
        modules: [
          { identifier: "concepts", disabled: false },
          { identifier: "structures", disabled: false },
        ],
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
        ].map((identifier) => ({ identifier, disabled: false })),
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
          { identifier: "concepts", disabled: false },
          { identifier: "classifications", disabled: false },
          { identifier: "operations", disabled: false },
          { identifier: "structures", disabled: false },
          { identifier: "codelists", disabled: false },
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

  it("keeps a disabled module on the page, greyed out and not clickable", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [
          { identifier: "concepts", disabled: false },
          { identifier: "classifications", disabled: false },
          { identifier: "operations", disabled: false },
          { identifier: "ddi", disabled: true },
        ],
      },
    });

    (hasAccessToModule as any).mockImplementation(() => true);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const [firstRow] = screen.getAllByRole("list");

    expect(
      within(firstRow)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/concepts", "/classifications", "/operations"]);

    const variables = screen.getByText("Variables").closest("li");

    expect(variables).toBeInTheDocument();
    expect(variables).toHaveClass("disabled");
    expect(within(variables!).getByText("Module indisponible pour le moment")).toBeInTheDocument();
  });

  it("hides a disabled module the user has no access to", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });
    (useAppContext as any).mockReturnValue({
      properties: {
        modules: [
          { identifier: "concepts", disabled: false },
          { identifier: "ddi", disabled: true },
        ],
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
        modules: [
          { identifier: "concepts", disabled: false },
          { identifier: "classifications", disabled: false },
        ],
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
