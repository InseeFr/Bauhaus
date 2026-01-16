import { render, fireEvent, screen } from "@testing-library/react";

import { CollapsiblePanel } from ".";

describe("Collapsible Panel", () => {
  it("should display children content", () => {
    render(
      <CollapsiblePanel id="id" title="title" collapsible={false}>
        Children
      </CollapsiblePanel>,
    );
    const div = screen.getByText("Children");
    expect(div.getAttribute("hidden")).toBeFalsy();
    expect(div.getAttribute("aria-labelledby")).toBe("idbutton");
    expect(div.id).toBe("idbody");
  });
  it("should not be collapsible", () => {
    const { container } = render(
      <CollapsiblePanel id="id" title="title" collapsible={false}>
        Children
      </CollapsiblePanel>,
    );
    expect(container.querySelector("#idbutton")).toBeNull();
  });
  it("should be expanded by default", () => {
    const { container } = render(
      <CollapsiblePanel id="id" title="title" hidden={false}>
        Children
      </CollapsiblePanel>,
    );
    expect(container.querySelector("#idbutton")).not.toBeNull();
    expect(container.querySelector("#idbody")).not.toHaveAttribute("hidden");
  });
  it("should be collapsed by default", () => {
    const { container } = render(
      <CollapsiblePanel id="id" title="title" hidden={true}>
        Children
      </CollapsiblePanel>,
    );
    expect(container.querySelector("#idbutton")).not.toBeNull();
    expect(container.querySelector("#idbody")).toHaveAttribute("hidden");
  });
  it("should be expanded after clicking to the button", () => {
    const { container } = render(
      <CollapsiblePanel id="id" title="title" hidden={false}>
        Children
      </CollapsiblePanel>,
    );
    expect(container.querySelector("#idbody")).not.toHaveAttribute("hidden");

    fireEvent.click(container.querySelector("#idbutton")!);

    expect(container.querySelector("#idbody")).toHaveAttribute("hidden");
  });
});
