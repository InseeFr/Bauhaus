import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClassificationSelect } from "./ClassificationSelect";

const mockClassifications = [
  { id: "coicop2016", prefLabelLg1: "COICOP 2016", label: "COICOP 2016" },
  { id: "coicop1998", prefLabelLg1: "COICOP 1998", label: "COICOP 1998" },
  { id: "naf2008", prefLabelLg1: "NAF 2008", label: "NAF 2008" },
];

vi.mock("../../../../hooks", () => ({
  useClassifications: vi.fn(),
}));

vi.mock("@components/select-rmes", () => ({
  Select: ({ value, options, onChange }: any) => (
    <select data-testid="select" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

import * as hooks from "../../../../hooks";

describe("ClassificationSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (hooks.useClassifications as any).mockReturnValue({
      classifications: mockClassifications,
    });
  });

  it("renders all classifications as options", () => {
    render(<ClassificationSelect value={undefined} onChange={vi.fn()} />);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("excludes the classification matching excludeId", () => {
    render(<ClassificationSelect excludeId="coicop2016" value={undefined} onChange={vi.fn()} />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options.map((o) => o.getAttribute("value"))).not.toContain("coicop2016");
  });

  it("passes the current value to Select", () => {
    render(<ClassificationSelect value="coicop1998" onChange={vi.fn()} />);
    expect(screen.getByTestId("select")).toHaveValue("coicop1998");
  });

  it("calls onChange with the selected value", async () => {
    const onChange = vi.fn();
    render(<ClassificationSelect value={undefined} onChange={onChange} />);

    const select = screen.getByTestId("select");
    const { fireEvent } = await import("@testing-library/react");
    fireEvent.change(select, { target: { value: "naf2008" } });

    expect(onChange).toHaveBeenCalledWith("naf2008");
  });

  it("renders with empty options when classifications is undefined", () => {
    (hooks.useClassifications as any).mockReturnValue({ classifications: undefined });
    render(<ClassificationSelect value={undefined} onChange={vi.fn()} />);
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
