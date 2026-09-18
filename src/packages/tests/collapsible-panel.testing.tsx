import { fireEvent, render } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { expect, it } from "vitest";

interface CollapsiblePanelProps {
  id: string;
  title: ReactNode;
  hidden?: boolean;
  collapsible?: boolean;
  children: ReactNode;
}

/** Comportement commun aux `CollapsiblePanel` des modules (listes de codes, structures). */
export const itBehavesAsACollapsiblePanel = (
  CollapsiblePanel: ComponentType<CollapsiblePanelProps>,
  children: ReactNode,
) => {
  const renderPanel = (props: Partial<CollapsiblePanelProps>) =>
    render(
      <CollapsiblePanel id="id" title="title" {...props}>
        {children}
      </CollapsiblePanel>,
    );

  it("should not be collapsible", () => {
    const { container } = renderPanel({ collapsible: false });
    expect(container.querySelector("#idbutton")).toBeNull();
  });
  it("should be expanded by default", () => {
    const { container } = renderPanel({ hidden: false });
    expect(container.querySelector("#idbutton")).not.toBeNull();
    expect(container.querySelector("#idbody")).not.toHaveAttribute("hidden");
  });
  it("should be collapsed by default", () => {
    const { container } = renderPanel({ hidden: true });
    expect(container.querySelector("#idbutton")).not.toBeNull();
    expect(container.querySelector("#idbody")).toHaveAttribute("hidden");
  });
  it("should be expanded after clicking to the button", () => {
    const { container } = renderPanel({ hidden: false });
    expect(container.querySelector("#idbody")).not.toHaveAttribute("hidden");

    fireEvent.click(container.querySelector("#idbutton")!);

    expect(container.querySelector("#idbody")).toHaveAttribute("hidden");
  });
};
