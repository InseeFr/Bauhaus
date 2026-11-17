import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges } from "@utils/hooks/users";

import { mockDdiAccess } from "../../components/GlobalActionsCard/actions.testing";
import { HomePageMenu } from "./menu";

vi.mock("@components/new-button", () => ({
  MasculineButton: ({ action, component }: any) => (
    <button type="button" onClick={action} data-component={component}>
      Nouveau
    </button>
  ),
}));

vi.mock("./EvictCachesButton", () => ({
  EvictCachesButton: () => <button type="button">Vider le cache</button>,
}));

vi.mock("@components/vertical-menu", () => ({
  VerticalMenu: ({ children }: any) => <div data-testid="vertical-menu">{children}</div>,
}));

// À la création il n'y a pas de ressource : le gating ne dépend pas des
// stamps mais seulement de la stratégie du privilège CREATE.
vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../privileges.testing")).mockUsersHooks(importOriginal),
);

/** Réponse de `usePrivileges` accordant plusieurs privilèges sur les PhysicalInstances. */
const ddiPrivileges = (privileges: { privilege: string; strategy: string }[]) => ({
  privileges: [{ application: "DDI_PHYSICALINSTANCE", privileges }],
});

describe("HomePageMenu", () => {
  const mockOnCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDdiAccess("CREATE", "ALL", []);
  });

  it("rend le menu vertical", () => {
    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.getByTestId("vertical-menu")).toBeInTheDocument();
  });

  it("affiche le bouton de création quand la stratégie CREATE est ALL", () => {
    mockDdiAccess("CREATE", "ALL", []);

    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.queryByText("Nouveau")).toBeInTheDocument();
  });

  it("affiche le bouton de création quand la stratégie CREATE est STAMP (le filtrage STAMP a lieu au choix du groupe)", () => {
    mockDdiAccess("CREATE", "STAMP", []);

    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.queryByText("Nouveau")).toBeInTheDocument();
  });

  it("masque le bouton de création quand la stratégie CREATE est NONE", () => {
    mockDdiAccess("CREATE", "NONE", []);

    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.queryByText("Nouveau")).not.toBeInTheDocument();
  });

  it("masque le bouton de création en l'absence de privilège CREATE", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [] });

    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.queryByText("Nouveau")).not.toBeInTheDocument();
  });

  it("appelle onCreate au clic sur le bouton", () => {
    render(<HomePageMenu onCreate={mockOnCreate} />);

    fireEvent.click(screen.getByText("Nouveau"));

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  it("passe component='button' à MasculineButton", () => {
    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.getByText("Nouveau")).toHaveAttribute("data-component", "button");
  });

  it("affiche le bouton de vidage du cache aux administrateurs", () => {
    (usePrivileges as any).mockReturnValue(
      ddiPrivileges([
        { privilege: "CREATE", strategy: "ALL" },
        { privilege: "ADMINISTRATION", strategy: "ALL" },
      ]),
    );

    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.getByRole("button", { name: "Vider le cache" })).toBeInTheDocument();
  });

  it("masque le bouton de vidage du cache sans privilège ADMINISTRATION", () => {
    (usePrivileges as any).mockReturnValue(
      ddiPrivileges([{ privilege: "CREATE", strategy: "ALL" }]),
    );

    render(<HomePageMenu onCreate={mockOnCreate} />);

    expect(screen.queryByRole("button", { name: "Vider le cache" })).not.toBeInTheDocument();
  });
});
