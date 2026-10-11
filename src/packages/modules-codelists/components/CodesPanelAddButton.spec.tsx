import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Codelist } from "@model/Codelist";

import { mockCodelistPrivileges } from "../testing/users.testing";
import { CodesPanelAddButton } from "./CodesPanelAddButton";

vi.mock("@utils/hooks/users", () => import("../testing/users.testing"));

describe("CodesPanelAddButton", () => {
  const mockOnHandlePanel = vi.fn();
  const contributedCodelist = { lastCodeUriSegment: "segment", contributor: "test-contributor" };

  const renderButton = (codelist: object) =>
    render(
      <CodesPanelAddButton
        codelist={codelist as unknown as Codelist}
        onHandlePanel={mockOnHandlePanel}
      />,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render if codelist.lastCodeUriSegment is missing", () => {
    mockCodelistPrivileges([{ privilege: "CREATE", strategy: "ALL" }], ["test-stamp"]);

    renderButton({});

    expect(screen.queryByRole("button", { name: /add/i })).toBeNull();
  });

  it("should render the button if user is an admin", () => {
    mockCodelistPrivileges([{ privilege: "CREATE", strategy: "ALL" }], ["test-stamp"]);

    renderButton({ lastCodeUriSegment: "segment" });

    screen.getByRole("button", { name: /add/i });
  });

  it("should render the button if user has contributor rights based on stamp", () => {
    mockCodelistPrivileges([{ privilege: "CREATE", strategy: "STAMP" }], ["test-contributor"]);

    renderButton(contributedCodelist);

    screen.getByRole("button", { name: /add/i });
  });

  it("should not render the button if user lacks the required permissions", () => {
    mockCodelistPrivileges([{ privilege: "CREATE", strategy: "STAMP" }], ["test-stamp"]);

    renderButton(contributedCodelist);

    expect(screen.queryByRole("button", { name: /add/i })).toBeNull();
  });

  it("should trigger onHandlePanel when the button is clicked", () => {
    mockCodelistPrivileges([{ privilege: "CREATE", strategy: "STAMP" }], ["test-contributor"]);

    renderButton(contributedCodelist);

    const button = screen.getByRole("button", { name: /add/i });
    fireEvent.click(button);

    expect(mockOnHandlePanel).toHaveBeenCalledTimes(1);
  });
});
