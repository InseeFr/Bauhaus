import { screen } from "@testing-library/react";

import { renderWithAppContext } from "../../../tests/render";
import OperationsFamilyVisualization from "./visualization";
import { ValidationState } from "../../../components/status";

const mockFamily = {
  id: "1",
  prefLabelLg1: "Family Label LG1",
  prefLabelLg2: "Family Label LG2",
  abstractLg1: "Abstract content **with markdown** in LG1",
  abstractLg2: "Abstract content **with markdown** in LG2",
  created: "2024-01-01T00:00:00.000Z",
  modified: "2024-06-01T00:00:00.000Z",
  validationState: "Validated" as ValidationState,
  series: [
    { id: "s1", labelLg1: "Series 1", labelLg2: "Série 1" },
    { id: "s2", labelLg1: "Series 2", labelLg2: "Série 2" },
  ],
};

describe("OperationsFamilyVisualization", () => {
  it("should render global information note with creation and update dates", () => {
    renderWithAppContext(<OperationsFamilyVisualization attr={mockFamily} secondLang={false} />);

    expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/06\/01\/2024/)).toBeInTheDocument();
  });

  it("should render abstract for main language only when secondLang is false", () => {
    renderWithAppContext(<OperationsFamilyVisualization attr={mockFamily} secondLang={false} />);

    expect(screen.getByText(/Abstract content/)).toBeInTheDocument();
    expect(screen.queryByText(/Family Label LG2/)).not.toBeInTheDocument();
  });

  it("should render abstracts for both languages when secondLang is true", () => {
    const { container } = renderWithAppContext(
      <OperationsFamilyVisualization attr={mockFamily} secondLang={true} />,
    );

    const abstractElements = screen.getAllByText(/Abstract content/);
    expect(abstractElements).toHaveLength(2);

    expect(screen.getByText(/in LG1/)).toBeInTheDocument();
    expect(screen.getByText(/in LG2/)).toBeInTheDocument();

    const noteElements = container.querySelectorAll(".note");
    expect(noteElements[1]).toHaveClass("col-md-6");
    expect(noteElements[2]).toHaveClass("col-md-6");
  });

  it("should render markdown content in abstracts", () => {
    const { container } = renderWithAppContext(
      <OperationsFamilyVisualization attr={mockFamily} secondLang={false} />,
    );

    const strongElements = container.querySelectorAll("strong");
    expect(strongElements.length).toBeGreaterThan(0);
  });

  it("should render relations view with series", () => {
    renderWithAppContext(<OperationsFamilyVisualization attr={mockFamily} secondLang={false} />);

    expect(screen.getByText("Series 1")).toBeInTheDocument();
    expect(screen.getByText("Series 2")).toBeInTheDocument();
  });

  it("should handle empty abstract gracefully", () => {
    const familyWithoutAbstract = {
      ...mockFamily,
      abstractLg1: "",
      abstractLg2: "",
    };

    const { container } = renderWithAppContext(
      <OperationsFamilyVisualization attr={familyWithoutAbstract} secondLang={false} />,
    );

    expect(container.querySelectorAll(".note")).toHaveLength(3);
  });

  it("should render publication status", () => {
    const { container } = renderWithAppContext(
      <OperationsFamilyVisualization attr={mockFamily} secondLang={false} />,
    );

    const statusElement = container.querySelector("ul li:nth-child(3)");
    expect(statusElement).toBeInTheDocument();
    expect(statusElement?.textContent).toContain("État de la famille");
  });
});
