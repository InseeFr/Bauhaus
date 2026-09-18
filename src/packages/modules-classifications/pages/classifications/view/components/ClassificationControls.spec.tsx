import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { mockGoBack } from "../../../../testing/component-mocks.testing";

let mockHasAccessRender = true;

vi.mock("@utils/hooks/useGoBack", () => import("../../../../testing/component-mocks.testing"));

vi.mock("@components/action-toolbar", () => import("../../../../testing/component-mocks.testing"));

vi.mock("@components/buttons/buttons-with-icons", async () => ({
  ReturnButton: (await import("../../../../testing/component-mocks.testing")).ReturnButton,
  UpdateButton: ({ action }: { action: string }) => (
    <a data-testid="update-button" href={action}>
      Update
    </a>
  ),
  TreeButton: ({ action, label }: { action: string; label: string }) => (
    <a data-testid="tree-button" href={action}>
      {label}
    </a>
  ),
}));

vi.mock("@components/validationButton", () => ({
  ValidationButton: ({ callback }: { callback: () => void }) => (
    <button data-testid="publish-button" onClick={callback}>
      Publish
    </button>
  ),
}));

vi.mock("../../../../../auth/components/auth", () => ({
  HasAccess: ({ children }: { children: React.ReactNode }) =>
    mockHasAccessRender ? children : null,
}));

import { ClassificationControls } from "./ClassificationControls";

const classification = { id: "pcs2020" } as any;

const renderMenu = (pathname = "/classifications/classification/pcs2020") =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <ClassificationControls classification={classification} publish={vi.fn()} />
    </MemoryRouter>,
  );

describe("<Menu />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHasAccessRender = true;
  });

  it("affiche le bouton Retour", () => {
    renderMenu();
    expect(screen.getByTestId("return-button")).toBeInTheDocument();
  });

  it("le bouton Retour appelle goBack avec /classifications", () => {
    renderMenu();
    fireEvent.click(screen.getByTestId("return-button"));
    expect(mockGoBack).toHaveBeenCalledWith("/classifications");
  });

  it("affiche le bouton Publier avec le droit PUBLISH", () => {
    mockHasAccessRender = true;
    renderMenu();
    expect(screen.getByTestId("publish-button")).toBeInTheDocument();
  });

  it("affiche le lien Modifier avec le bon href avec le droit UPDATE", () => {
    mockHasAccessRender = true;
    renderMenu();
    const updateLink = screen.getByTestId("update-button");
    expect(updateLink).toBeInTheDocument();
    expect(updateLink).toHaveAttribute("href", "/classifications/classification/pcs2020/modify");
  });

  it("n'affiche pas Publier ni Modifier sans droits", () => {
    mockHasAccessRender = false;
    renderMenu();
    expect(screen.queryByTestId("publish-button")).toBeNull();
    expect(screen.queryByTestId("update-button")).toBeNull();
  });

  it("affiche le bouton Arbre avec un lien contenant /tree", () => {
    renderMenu("/classifications/classification/pcs2020");
    const treeButton = screen.getByTestId("tree-button");
    expect(treeButton.getAttribute("href")).toContain("/tree");
  });

  it("appelle publish au clic sur le bouton Publier", () => {
    const publish = vi.fn();
    render(
      <MemoryRouter initialEntries={["/classifications/classification/pcs2020"]}>
        <ClassificationControls classification={classification} publish={publish} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("publish-button"));
    expect(publish).toHaveBeenCalledTimes(1);
  });
});
