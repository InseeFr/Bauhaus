import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  CollapsibleTrigger,
  MenuTabInErrorIndicator,
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

describe("MenuTabInErrorIndicator", () => {
  it('should display a warning icon if "isInError" is true', () => {
    render(<MenuTabInErrorIndicator isInError={true} />);
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });

  it('should render nothing if "isInError" is false', () => {
    const { container } = render(<MenuTabInErrorIndicator isInError={false} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("LayoutWithLateralMenu", () => {
  const mockLayoutConfiguration = {
    main1: {
      children: {
        sub1: { closed: false, title: "Sub Item 1", isInError: false },
        sub2: { closed: false, title: "Sub Item 2", isInError: true },
      },
      closed: false,
      title: "Main Item 1",
      isInError: false,
    },
    main2: {
      children: {},
      closed: true,
      title: "Main Item 2",
      isInError: false,
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
