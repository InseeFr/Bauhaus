import { fireEvent, render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { CodesList } from "@model/CodesList";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";
import { CodeSlidingPanelMenu } from "./code-sliding-panel-menu";

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: vi.fn(),
    useUserStamps: vi.fn(),
  };
});

describe("CodeSlidingPanelMenu", () => {
  const mockHandleSubmit = vi.fn();
  const mockHandleBack = vi.fn();
  const codelist = { contributor: "test-contributor" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ReturnButton", () => {
    (usePrivileges as Mock).mockReturnValue({ privileges: [] });
    (useUserStamps as Mock).mockReturnValue({ data: [] });

    render(
      <CodeSlidingPanelMenu
        codelist={codelist as unknown as CodesList}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={false}
      />,
    );

    screen.getByRole("button", { name: /back/i });
  });

  it("renders the UpdateButton when not in creation mode and has permission", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "UPDATE", strategy: "STAMP" }],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({
      data: [{ stamp: "test-contributor" }],
    });

    render(
      <CodeSlidingPanelMenu
        codelist={codelist as unknown as CodesList}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={false}
      />,
    );

    screen.getByRole("button", { name: /update/i });
  });

  it("renders the SaveButton when in creation mode and has permission", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "CREATE", strategy: "STAMP" }],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({
      data: [{ stamp: "test-contributor" }],
    });

    render(
      <CodeSlidingPanelMenu
        codelist={codelist as unknown as CodesList}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={true}
      />,
    );

    screen.getByRole("button", { name: /save/i });
  });

  it("does not render UpdateButton or SaveButton when user lacks permissions", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "UPDATE", strategy: "STAMP" }],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({
      data: [{ stamp: "other-contributor" }],
    });

    render(
      <CodeSlidingPanelMenu
        codelist={codelist as unknown as CodesList}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={false}
      />,
    );

    expect(screen.queryByRole("button", { name: /update/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /save/i })).toBeNull();
  });

  it("renders the UpdateButton and SaveButton for admin users", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [
            { privilege: "UPDATE", strategy: "ALL" },
            { privilege: "CREATE", strategy: "ALL" },
          ],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({ data: [] });

    render(
      <CodeSlidingPanelMenu
        codelist={codelist as unknown as CodesList}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={false}
      />,
    );

    screen.getByRole("button", { name: /update/i });

    render(
      <CodeSlidingPanelMenu
        codelist={codelist as unknown as CodesList}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={true}
      />,
    );

    screen.getByRole("button", { name: /save/i });
  });

  it("triggers the appropriate actions on button clicks", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "UPDATE", strategy: "ALL" }],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({ data: [] });

    render(
      <CodeSlidingPanelMenu
        codelist={codelist as unknown as CodesList}
        handleSubmit={mockHandleSubmit}
        handleBack={mockHandleBack}
        creation={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(mockHandleBack).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /update/i }));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
