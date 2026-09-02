import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { RightSlidingPanel } from "./index";

describe("RightSlidingPanel", () => {
  it("does not render its content when closed", () => {
    render(
      <RightSlidingPanel isOpen={false} onHide={vi.fn()}>
        <div>Panel content</div>
      </RightSlidingPanel>,
    );

    expect(screen.queryByText("Panel content")).toBeNull();
  });

  it("renders its content when opened", () => {
    render(
      <RightSlidingPanel isOpen onHide={vi.fn()}>
        <div>Panel content</div>
      </RightSlidingPanel>,
    );

    screen.getByText("Panel content");
  });

  it("opens on the right side and takes 60% of the width by default", () => {
    const { baseElement } = render(
      <RightSlidingPanel isOpen onHide={vi.fn()}>
        <div>Panel content</div>
      </RightSlidingPanel>,
    );

    expect(baseElement.querySelector(".p-sidebar-mask.p-sidebar-right")).toBeTruthy();
    expect(baseElement.querySelector<HTMLElement>(".p-sidebar")!.style.width).toBe("60%");
  });

  it("uses the given size as a percentage of the width", () => {
    const { baseElement } = render(
      <RightSlidingPanel isOpen size={30} onHide={vi.fn()}>
        <div>Panel content</div>
      </RightSlidingPanel>,
    );

    expect(baseElement.querySelector<HTMLElement>(".p-sidebar")!.style.width).toBe("30%");
  });

  it("applies the given class name on the panel", () => {
    const { baseElement } = render(
      <RightSlidingPanel isOpen panelClassName="code-list-panel" onHide={vi.fn()}>
        <div>Panel content</div>
      </RightSlidingPanel>,
    );

    expect(baseElement.querySelector(".p-sidebar.code-list-panel")).toBeTruthy();
  });

  it("calls onHide when the close button is clicked", async () => {
    const onHide = vi.fn();
    render(
      <RightSlidingPanel isOpen onHide={onHide}>
        <div>Panel content</div>
      </RightSlidingPanel>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onHide).toHaveBeenCalled();
  });
});
