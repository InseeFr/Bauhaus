import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Menu } from "./menu";

const mockGoBack = vi.fn();

vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: () => mockGoBack,
}));

vi.mock("@components/action-toolbar", () => ({
  ActionToolbar: ({ children }) => <div data-testid="action-toolbar">{children}</div>,
}));

vi.mock("@components/buttons/buttons-with-icons", () => ({
  ReturnButton: ({ action }) => (
    <button data-testid="return-button" onClick={action}>
      Back
    </button>
  ),
}));

const renderControls = (pathname = "/classifications/classification/coicop2016/items") =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Menu />
    </MemoryRouter>,
  );

describe("<Controls /> (items)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("se rend sans planter", () => {
    renderControls();
  });

  it("affiche le bouton Retour", () => {
    renderControls();
    expect(screen.getByTestId("return-button")).toBeInTheDocument();
  });

  it("rend l'ActionToolbar", () => {
    renderControls();
    expect(screen.getByTestId("action-toolbar")).toBeInTheDocument();
  });

  it("appelle goBack avec le chemin sans /items au clic", () => {
    renderControls("/classifications/classification/coicop2016/items");
    fireEvent.click(screen.getByTestId("return-button"));
    expect(mockGoBack).toHaveBeenCalledWith("/classifications/classification/coicop2016");
  });
});
