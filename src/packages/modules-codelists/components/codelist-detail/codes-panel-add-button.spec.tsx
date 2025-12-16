import { fireEvent, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { Mock, vi } from "vitest";

import { CodesList } from "@model/CodesList";

import { usePrivileges } from "@utils/hooks/users";
import { CodesPanelAddButton } from "./codes-panel-add-button";

vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-redux")>();
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: vi.fn(),
  };
});

describe("CodesPanelAddButton", () => {
  const mockOnHandlePanel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render if codelist.lastCodeUriSegment is missing", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "CREATE", strategy: "ALL" }],
        },
      ],
    });
    (useSelector as Mock).mockReturnValue({
      stamp: "test-stamp",
    });

    render(
      <CodesPanelAddButton
        codelist={{} as unknown as CodesList}
        onHandlePanel={mockOnHandlePanel}
      />,
    );

    expect(screen.queryByRole("button", { name: /add/i })).toBeNull();
  });

  it("should render the button if user is an admin", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "CREATE", strategy: "ALL" }],
        },
      ],
    });
    (useSelector as Mock).mockReturnValue({
      stamp: "test-stamp",
    });

    render(
      <CodesPanelAddButton
        codelist={{ lastCodeUriSegment: "segment" } as unknown as CodesList}
        onHandlePanel={mockOnHandlePanel}
      />,
    );

    screen.getByRole("button", { name: /add/i });
  });

  it("should render the button if user has contributor rights based on stamp", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "CREATE", strategy: "STAMP" }],
        },
      ],
    });
    (useSelector as Mock).mockReturnValue({
      stamp: "test-contributor",
    });

    render(
      <CodesPanelAddButton
        codelist={
          {
            lastCodeUriSegment: "segment",
            contributor: "test-contributor",
          } as unknown as CodesList
        }
        onHandlePanel={mockOnHandlePanel}
      />,
    );

    screen.getByRole("button", { name: /add/i });
  });

  it("should not render the button if user lacks the required permissions", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "CREATE", strategy: "STAMP" }],
        },
      ],
    });
    (useSelector as Mock).mockReturnValue({
      stamp: "test-stamp",
    });

    render(
      <CodesPanelAddButton
        codelist={
          {
            lastCodeUriSegment: "segment",
            contributor: "test-contributor",
          } as unknown as CodesList
        }
        onHandlePanel={mockOnHandlePanel}
      />,
    );

    expect(screen.queryByRole("button", { name: /add/i })).toBeNull();
  });

  it("should trigger onHandlePanel when the button is clicked", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [{ privilege: "CREATE", strategy: "STAMP" }],
        },
      ],
    });
    (useSelector as Mock).mockReturnValue({
      stamp: "test-contributor",
    });

    render(
      <CodesPanelAddButton
        codelist={
          {
            lastCodeUriSegment: "segment",
            contributor: "test-contributor",
          } as unknown as CodesList
        }
        onHandlePanel={mockOnHandlePanel}
      />,
    );

    const button = screen.getByRole("button", { name: /add/i });
    fireEvent.click(button);

    expect(mockOnHandlePanel).toHaveBeenCalledTimes(1);
  });
});
