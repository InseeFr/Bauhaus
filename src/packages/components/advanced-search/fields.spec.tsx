import { render, screen } from "@testing-library/react";

import { AdvancedSearchCard } from "./fields";

describe("AdvancedSearchCard", () => {
  it("renders a card with a form grid wrapping its children", () => {
    const { container } = render(
      <AdvancedSearchCard title="My section" className="x-form">
        <div data-testid="child" />
      </AdvancedSearchCard>,
    );

    expect(container.querySelector(".grid.formgrid")).not.toBeNull();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
