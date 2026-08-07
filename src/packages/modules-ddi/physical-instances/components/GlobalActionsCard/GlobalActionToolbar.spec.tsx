import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";
import { GlobalActionToolbar } from "./GlobalActionToolbar";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.export": "Exporter",
        "physicalInstance.view.duplicatePhysicalInstance": "Dupliquer",
        "physicalInstance.view.validateDdi4": "Valider le DDI4",
      };
      return translations[key] || key;
    },
  }),
}));

// On monte le vrai <HasAccess> ; seules les sources de privilèges et de
// stamps sont mockées.
vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return { ...actual, usePrivileges: vi.fn(), useUserStamps: vi.fn() };
});

const ddiPrivileges = (strategy: string) => ({
  privileges: [
    {
      application: "DDI_PHYSICALINSTANCE",
      privileges: [{ privilege: "CREATE", strategy }],
    },
  ],
});

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick, icon, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {icon && <span className={icon} />}
      {label}
    </button>
  ),
}));

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
  const mockOnDuplicate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Par défaut : stratégie ALL → le bouton de duplication est rendu.
    (usePrivileges as any).mockReturnValue(ddiPrivileges("ALL"));
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });
  });

  it("should render export and duplicate buttons", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

    expect(screen.getByText("Exporter")).toBeInTheDocument();
    expect(screen.getByText("Dupliquer")).toBeInTheDocument();
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

  it("should render buttons with correct icons", () => {
    const { container } = render(
      <GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />,
    );

    const downloadIcon = container.querySelector(".pi-download");
    const copyIcon = container.querySelector(".pi-copy");

    expect(downloadIcon).toBeInTheDocument();
    expect(copyIcon).toBeInTheDocument();
  });

  it("should render buttons with secondary severity", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

    const splitButton = screen.getByTestId("split-button");
    const duplicateButton = screen.getByLabelText("Dupliquer");

    expect(splitButton).toHaveAttribute("severity", "secondary");
    expect(duplicateButton).toHaveAttribute("severity", "secondary");
  });

  it("should call onDuplicate when duplicate button is clicked", () => {
    render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

    const duplicateButton = screen.getByText("Dupliquer");
    fireEvent.click(duplicateButton);

    expect(mockOnDuplicate).toHaveBeenCalledTimes(1);
  });

  it("should render without onDuplicate callback", () => {
    expect(() => render(<GlobalActionToolbar onExport={mockOnExport} />)).not.toThrow();
    expect(screen.getByText("Dupliquer")).toBeInTheDocument();
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

  describe("gating STAMP du bouton de duplication", () => {
    it("affiche le bouton de duplication quand un stamp utilisateur appartient aux stamps de l'instance source", () => {
      (usePrivileges as any).mockReturnValue(ddiPrivileges("STAMP"));
      (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

      render(
        <GlobalActionToolbar
          onExport={mockOnExport}
          onDuplicate={mockOnDuplicate}
          stamps={["STAMP1", "STAMP2"]}
        />,
      );

      expect(screen.queryByText("Dupliquer")).toBeInTheDocument();
    });

    it("masque le bouton de duplication quand aucun stamp utilisateur n'appartient aux stamps de l'instance source", () => {
      (usePrivileges as any).mockReturnValue(ddiPrivileges("STAMP"));
      (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP9" }] });

      render(
        <GlobalActionToolbar
          onExport={mockOnExport}
          onDuplicate={mockOnDuplicate}
          stamps={["STAMP1", "STAMP2"]}
        />,
      );

      expect(screen.queryByText("Dupliquer")).not.toBeInTheDocument();
    });
  });
});
