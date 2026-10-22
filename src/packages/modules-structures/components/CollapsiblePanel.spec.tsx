import { render, screen } from "@testing-library/react";

import { itBehavesAsACollapsiblePanel } from "../../tests/collapsible-panel.testing";
import { CollapsiblePanel } from "./CollapsiblePanel";

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

  itBehavesAsACollapsiblePanel(CollapsiblePanel, "Children");
});
