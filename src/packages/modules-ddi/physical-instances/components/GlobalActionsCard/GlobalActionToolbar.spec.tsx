import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { mockDdiAccess } from "./actions.testing";
import { GlobalActionToolbar } from "./GlobalActionToolbar";

vi.mock("react-i18next", async () =>
  (await import("./translations.testing")).mockTranslations({
    "physicalInstance.view.export": "Exporter",
    "physicalInstance.view.duplicatePhysicalInstance": "Dupliquer",
    "physicalInstance.view.validateDdi4": "Valider le DDI4",
  }),
);

// On monte le vrai <HasAccess> ; seules les sources de privilèges et de
// stamps sont mockées.
vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../privileges.testing")).mockUsersHooks(importOriginal),
);

vi.mock("primereact/button", () => import("./actions.testing"));

vi.mock("primereact/splitbutton", () => ({
  SplitButton: ({ label, onClick, model, icon, ...props }: any) => (
    <div data-testid="split-button" {...props}>
      <button type="button" onClick={onClick} aria-label={props["aria-label"]}>
        {icon && <span className={icon} />}
        {label}
      </button>
      {model && (
        <div data-testid="split-button-menu">
          {model.map((item: any, index: number) => (
            <button
              key={index}
              type="button"
              onClick={item.command}
              data-testid={`menu-item-${item.label}`}
            >
              {item.icon && <span className={item.icon} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  ),
}));

describe("GlobalActionToolbar", () => {
  const mockOnExport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Droit de création accordé : même ainsi, la duplication n'est plus proposée ici.
    mockDdiAccess("CREATE", "ALL");
  });

  it("should render the export button", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} />);

    expect(screen.getByText("Exporter")).toBeInTheDocument();
  });

  it("ne propose plus la duplication : elle se fait depuis l'accueil (« Nouveau à partir de… »)", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} />);

    expect(screen.queryByText("Dupliquer")).not.toBeInTheDocument();
  });

  it("should call onExport with DDI3 when export button is clicked", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} />);

    const exportButton = screen.getByText("Exporter");
    fireEvent.click(exportButton);

    expect(mockOnExport).toHaveBeenCalledTimes(1);
    expect(mockOnExport).toHaveBeenCalledWith("DDI3");
  });

  it("should render export menu with DDI3 and DDI4 options", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} />);

    expect(screen.getByTestId("menu-item-DDI 3.3")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-DDI 4.0/JSON")).toBeInTheDocument();
  });

  it("should call onExport with DDI3 when DDI3 menu item is clicked", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} />);

    const ddi3MenuItem = screen.getByTestId("menu-item-DDI 3.3");
    fireEvent.click(ddi3MenuItem);

    expect(mockOnExport).toHaveBeenCalledTimes(1);
    expect(mockOnExport).toHaveBeenCalledWith("DDI3");
  });

  it("should call onExport with DDI4 when DDI4 menu item is clicked", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} />);

    const ddi4MenuItem = screen.getByTestId("menu-item-DDI 4.0/JSON");
    fireEvent.click(ddi4MenuItem);

    expect(mockOnExport).toHaveBeenCalledTimes(1);
    expect(mockOnExport).toHaveBeenCalledWith("DDI4");
  });

  it("should have correct aria-labels for accessibility", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} />);

    // SplitButton creates multiple elements with the same aria-label
    const exportElements = screen.getAllByLabelText("Exporter");
    expect(exportElements.length).toBeGreaterThan(0);
  });

  it("should render the export button with its icon and secondary severity", () => {
    const { container } = render(<GlobalActionToolbar onExport={mockOnExport} />);

    expect(container.querySelector(".pi-download")).toBeInTheDocument();
    expect(screen.getByTestId("split-button")).toHaveAttribute("severity", "secondary");
  });

  describe("bouton de validation DDI4 (localhost uniquement)", () => {
    const mockOnValidateDdi4 = vi.fn();

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("affiche le bouton quand le front est servi depuis localhost", () => {
      vi.stubGlobal("location", { hostname: "localhost" });

      render(<GlobalActionToolbar onExport={mockOnExport} onValidateDdi4={mockOnValidateDdi4} />);

      expect(screen.getByText("Valider le DDI4")).toBeInTheDocument();
    });

    it("masque le bouton quand le front est servi depuis un autre hôte", () => {
      vi.stubGlobal("location", { hostname: "bauhaus.insee.fr" });

      render(<GlobalActionToolbar onExport={mockOnExport} onValidateDdi4={mockOnValidateDdi4} />);

      expect(screen.queryByText("Valider le DDI4")).not.toBeInTheDocument();
    });

    it("appelle onValidateDdi4 au clic", () => {
      vi.stubGlobal("location", { hostname: "localhost" });

      render(<GlobalActionToolbar onExport={mockOnExport} onValidateDdi4={mockOnValidateDdi4} />);
      fireEvent.click(screen.getByText("Valider le DDI4"));

      expect(mockOnValidateDdi4).toHaveBeenCalledTimes(1);
    });

    it("n'affiche pas le bouton en localhost quand aucun callback n'est fourni", () => {
      vi.stubGlobal("location", { hostname: "localhost" });

      render(<GlobalActionToolbar onExport={mockOnExport} />);

      expect(screen.queryByText("Valider le DDI4")).not.toBeInTheDocument();
    });
  });
});
