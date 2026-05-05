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

const renderMenu = (pathname = "/classifications/classification/coicop2016/tree") =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Menu />
    </MemoryRouter>,
  );

describe("<Menu /> (tree)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("se rend sans planter", () => {
    renderMenu();
  });

  it("affiche le bouton Retour", () => {
    renderMenu();
    expect(screen.getByTestId("return-button")).toBeInTheDocument();
  });

  it("rend l'ActionToolbar", () => {
    renderMenu();
    expect(screen.getByTestId("action-toolbar")).toBeInTheDocument();
  });

  it("appelle goBack avec le chemin sans /tree au clic", () => {
    renderMenu("/classifications/classification/coicop2016/tree");
    fireEvent.click(screen.getByTestId("return-button"));
    expect(mockGoBack).toHaveBeenCalledWith("/classifications/classification/coicop2016");
  });
});
