import { screen } from "@testing-library/react";
import { renderWithRouter } from "../../../../../tests/render";
import { Controls } from "./Controls";

describe("classification-item-compare-controls", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Controls />);
  });

  it("renders the return button with the custom label", () => {
    renderWithRouter(<Controls />);
    expect(screen.getByText("Back to current version")).toBeInTheDocument();
  });

  it("renders the return button with an SVG icon", () => {
    const { container } = renderWithRouter(<Controls />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
