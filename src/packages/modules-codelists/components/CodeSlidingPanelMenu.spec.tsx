import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Codelist } from "@model/Codelist";

import { mockCodelistPrivileges } from "../testing/users.testing";
import { CodeSlidingPanelMenu } from "./CodeSlidingPanelMenu";

vi.mock("@utils/hooks/users", () => import("../testing/users.testing"));

const codelist = { contributor: "test-contributor" } as unknown as Codelist;

describe("CodeSlidingPanelMenu", () => {
  const mockHandleSubmit = vi.fn();
  const mockHandleBack = vi.fn();

  const renderMenu = (creation = false, codelistToRender = codelist) =>
    render(
      <CodeSlidingPanelMenu
        codelist={codelistToRender}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={creation}
      />,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ReturnButton", () => {
    mockCodelistPrivileges([]);

    renderMenu();

    screen.getByRole("button", { name: /back/i });
  });

  it("renders the UpdateButton when not in creation mode and has permission", () => {
    mockCodelistPrivileges([{ privilege: "UPDATE", strategy: "STAMP" }], ["test-contributor"]);

    renderMenu();

    screen.getByRole("button", { name: /update/i });
  });

  it("renders the SaveButton when in creation mode and has permission", () => {
    mockCodelistPrivileges([{ privilege: "CREATE", strategy: "STAMP" }], ["test-contributor"]);

    renderMenu(true);

    screen.getByRole("button", { name: /save/i });
  });

  it("renders the UpdateButton when one of several contributors is the user stamp", () => {
    mockCodelistPrivileges([{ privilege: "UPDATE", strategy: "STAMP" }], ["test-contributor"]);

    renderMenu(false, { contributor: ["other", "test-contributor"] } as unknown as Codelist);

    screen.getByRole("button", { name: /update/i });
  });

  it("does not render UpdateButton or SaveButton when user lacks permissions", () => {
    mockCodelistPrivileges([{ privilege: "UPDATE", strategy: "STAMP" }], ["other-contributor"]);

    renderMenu();

    expect(screen.queryByRole("button", { name: /update/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /save/i })).toBeNull();
  });

  it("renders the UpdateButton and SaveButton for admin users", () => {
    mockCodelistPrivileges([
      { privilege: "UPDATE", strategy: "ALL" },
      { privilege: "CREATE", strategy: "ALL" },
    ]);

    renderMenu();

    screen.getByRole("button", { name: /update/i });

    renderMenu(true);

    screen.getByRole("button", { name: /save/i });
  });

  it("triggers the appropriate actions on button clicks", () => {
    mockCodelistPrivileges([{ privilege: "UPDATE", strategy: "ALL" }]);

    renderMenu();

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(mockHandleBack).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /update/i }));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
