import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  CollapsibleTrigger,
  TabWithErrorIndicator,
  LayoutWithLateralMenu,
  LayoutConfiguration,
} from "./layout-with-lateral-menu";

describe("CollapsibleTrigger", () => {
  it('should display the correct title based on the "opened" prop', () => {
    render(<CollapsibleTrigger opened={true} onClick={vi.fn()} />);
    expect(screen.getByTitle("Hide")).toBeInTheDocument();

    render(<CollapsibleTrigger opened={false} onClick={vi.fn()} />);
    expect(screen.getByTitle("Display")).toBeInTheDocument();
  });

  it('should call "onClick" when clicked', () => {
    const handleClick = vi.fn();
    render(<CollapsibleTrigger opened={false} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});

describe("TabWithErrorIndicator", () => {
  it('should display a warning icon if "hasError" is true', () => {
    render(<TabWithErrorIndicator hasError={true} />);
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });

  it('should render nothing if "hasError" is false', () => {
    const { container } = render(<TabWithErrorIndicator hasError={false} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("LayoutWithLateralMenu", () => {
  const mockLayoutConfiguration = {
    main1: {
      children: {
        sub1: { closed: false, title: "Sub Item 1", hasError: false },
        sub2: { closed: false, title: "Sub Item 2", hasError: true },
      },
      closed: false,
      title: "Main Item 1",
      hasError: false,
    },
    main2: {
      children: {},
      closed: true,
      title: "Main Item 2",
      hasError: false,
    },
  } as unknown as LayoutConfiguration;

  const mockChildren = vi.fn((key: string) => <div>{`Content for ${key}`}</div>);

  beforeEach(() => {
    mockChildren.mockClear();
  });

  it("should render main menu items with their titles", () => {
    render(
      <LayoutWithLateralMenu
        layoutConfiguration={mockLayoutConfiguration}
        children={mockChildren}
      />,
    );
    expect(screen.getByText("Main Item 1")).toBeInTheDocument();
    expect(screen.getByText("Main Item 2")).toBeInTheDocument();
  });

  it("should display a warning icon for submenu tabs in error", () => {
    render(
      <LayoutWithLateralMenu
        layoutConfiguration={mockLayoutConfiguration}
        children={mockChildren}
      />,
    );
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });
});
