import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Menu } from "./menu";

const mockGoBack = vi.fn();

vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: () => mockGoBack,
}));

vi.mock("@components/action-toolbar", () => ({
  ActionToolbar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="action-toolbar">{children}</div>
  ),
}));

vi.mock("@components/buttons/buttons-with-icons", () => ({
  CancelButton: ({ action }: { action: string | (() => void) }) => (
    <button
      data-testid="cancel-button"
      type="button"
      onClick={() => (typeof action === "string" ? mockGoBack(action) : action())}
    >
      Annuler
    </button>
  ),
  SaveButton: ({ disabled, type }: { disabled?: boolean; type?: string }) => (
    <button data-testid="save-button" type={type} disabled={disabled}>
      Sauvegarder
    </button>
  ),
}));

const renderMenu = (disabled = false) =>
  render(
    <MemoryRouter>
      <Menu disabled={disabled} />
    </MemoryRouter>,
  );

describe("<Menu />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le bouton Annuler", () => {
    renderMenu();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
  });

  it("affiche le bouton Sauvegarder", () => {
    renderMenu();
    expect(screen.getByTestId("save-button")).toBeInTheDocument();
  });

  it("le bouton Sauvegarder est désactivé quand disabled=true", () => {
    renderMenu(true);
    expect(screen.getByTestId("save-button")).toBeDisabled();
  });

  it("le bouton Sauvegarder est actif quand disabled=false", () => {
    renderMenu(false);
    expect(screen.getByTestId("save-button")).not.toBeDisabled();
  });

  it("le bouton Sauvegarder est de type submit", () => {
    renderMenu();
    expect(screen.getByTestId("save-button")).toHaveAttribute("type", "submit");
  });

  it("le bouton Annuler appelle goBack avec /classifications au clic", () => {
    renderMenu();
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(mockGoBack).toHaveBeenCalledWith("/classifications");
  });

  it("rend les deux boutons dans l'ActionToolbar", () => {
    renderMenu();
    const toolbar = screen.getByTestId("action-toolbar");
    expect(toolbar).toBeInTheDocument();
    expect(toolbar.querySelectorAll("button")).toHaveLength(2);
  });
});
