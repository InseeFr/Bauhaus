import { render } from "@testing-library/react";

import PublishersView from "./";

describe("<PublishersView />", () => {
  it("renders the labelLg1 of a single OperationsLink publisher", () => {
    const { container } = render(
      <PublishersView publishers={[{ id: "X", labelLg1: "label", labelLg2: "label EN" }]} />,
    );
    expect(container.textContent).toContain("label");
  });

  it("renders a list of labels when given multiple OperationsLink", () => {
    const { container } = render(
      <PublishersView
        publishers={[
          { id: "A", labelLg1: "label", labelLg2: "label EN" },
          { id: "B", labelLg1: "label2", labelLg2: "label2 EN" },
        ]}
      />,
    );
    expect(container.textContent).toContain("label");
    expect(container.textContent).toContain("label2");
  });

  it("falls back to .label when labelLg1 is absent", () => {
    const { container } = render(<PublishersView publishers={[{ id: "X", label: "fallback" }]} />);
    expect(container.textContent).toContain("fallback");
  });

  it("wraps a single non-array publisher object", () => {
    const { container } = render(<PublishersView publishers={{ id: "X", labelLg1: "solo" }} />);
    expect(container.textContent).toContain("solo");
  });

  it("renders empty when publishers is undefined", () => {
    const { container } = render(<PublishersView />);
    expect(container.textContent ?? "").not.toContain("undefined");
  });
});
