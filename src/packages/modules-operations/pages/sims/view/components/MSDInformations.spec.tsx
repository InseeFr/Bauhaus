import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../components/SimsFieldTitle", () => ({
  SimsFieldTitle: ({ secondLang, msd }: { secondLang: boolean; msd: any }) => (
    <span data-testid={`field-title-${secondLang ? "lg2" : "lg1"}`}>{msd.idMas}</span>
  ),
}));
vi.mock("../../utils/hasLabelLg2", () => ({
  hasLabelLg2: vi.fn(() => false),
}));
vi.mock("./SimsBlock", () => ({
  SimsBlock: ({ msd, isSecondLang }: { msd: any; isSecondLang: boolean }) => (
    <div data-testid={`sims-block-${isSecondLang ? "lg2" : "lg1"}`}>{msd.idMas}</div>
  ),
}));
vi.mock("@components/panel", () => ({
  Panel: ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => (
    <div data-testid="panel">
      <div data-testid="panel-title">{title}</div>
      {children}
    </div>
  ),
}));

import { hasLabelLg2 } from "../../utils/hasLabelLg2";
import { MSDInformations } from "./MSDInformations";

const baseMsd = (overrides: Record<string, any> = {}) => ({
  idMas: "MAS1",
  masLabelBasedOnCurrentLang: "Label",
  isPresentational: false,
  children: {},
  maxOccurs: "1",
  ...overrides,
});

describe("MSDInformations - title display", () => {
  it("should display the title for a first-level item without children", () => {
    render(<MSDInformations msd={baseMsd()} firstLevel={true} rubrics={{}} secondLang={false} />);

    expect(screen.getByText("MAS1 - Label")).toBeInTheDocument();
  });

  it("should not display the title when the item has children", () => {
    render(
      <MSDInformations
        msd={baseMsd({ children: { child1: baseMsd({ idMas: "child1" }) } })}
        firstLevel={true}
        rubrics={{}}
        secondLang={false}
      />,
    );

    expect(screen.queryByText("MAS1 - Label")).not.toBeInTheDocument();
  });

  it("should not display the title when the item is not firstLevel", () => {
    render(<MSDInformations msd={baseMsd()} firstLevel={false} rubrics={{}} secondLang={false} />);

    expect(screen.queryByText("MAS1 - Label")).not.toBeInTheDocument();
  });
});

describe("MSDInformations - panels", () => {
  it("should render the lg1 panel and block for a non-presentational item", () => {
    render(<MSDInformations msd={baseMsd()} rubrics={{}} secondLang={false} />);

    expect(screen.getByTestId("sims-block-lg1")).toBeInTheDocument();
    expect(screen.queryByTestId("sims-block-lg2")).not.toBeInTheDocument();
  });

  it("should not render any panel for a presentational item", () => {
    render(
      <MSDInformations msd={baseMsd({ isPresentational: true })} rubrics={{}} secondLang={false} />,
    );

    expect(screen.queryByTestId("panel")).not.toBeInTheDocument();
  });

  it("should render the lg2 panel and block when hasLabelLg2 is true and secondLang is enabled", () => {
    vi.mocked(hasLabelLg2).mockReturnValueOnce(true);

    render(<MSDInformations msd={baseMsd()} rubrics={{}} secondLang={true} />);

    expect(screen.getByTestId("sims-block-lg2")).toBeInTheDocument();
  });

  it("should not render the lg2 panel when secondLang is disabled even if hasLabelLg2 is true", () => {
    vi.mocked(hasLabelLg2).mockReturnValueOnce(true);

    render(<MSDInformations msd={baseMsd()} rubrics={{}} secondLang={false} />);

    expect(screen.queryByTestId("sims-block-lg2")).not.toBeInTheDocument();
  });

  it("should pass the current section from rubrics down to SimsFieldTitle", () => {
    const rubrics = { MAS1: { rangeType: "TEXT" } } as any;

    render(<MSDInformations msd={baseMsd()} rubrics={rubrics} secondLang={false} />);

    expect(screen.getByTestId("field-title-lg1")).toHaveTextContent("MAS1");
  });
});

describe("MSDInformations - recursion", () => {
  it("should render children recursively", () => {
    const msd = baseMsd({
      children: {
        child1: baseMsd({ idMas: "child1", children: {} }),
        child2: baseMsd({ idMas: "child2", children: {} }),
      },
    });

    render(<MSDInformations msd={msd} rubrics={{}} secondLang={false} />);

    expect(screen.getAllByTestId("sims-block-lg1")).toHaveLength(3);
  });

  it("should forward codelists, organizations, rubrics and secondLang to descendants", () => {
    const rubrics = { child1: { rangeType: "TEXT" } } as any;
    const msd = baseMsd({
      children: { child1: baseMsd({ idMas: "child1", children: {} }) },
    });
    vi.mocked(hasLabelLg2).mockReturnValue(true);

    render(<MSDInformations msd={msd} rubrics={rubrics} secondLang={true} />);

    expect(screen.getAllByTestId("sims-block-lg2")).toHaveLength(2);
  });
});
