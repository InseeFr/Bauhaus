import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import { TemporalField } from "./temporalField";

const mockUpdateTemporalCoverage = vi.fn();

describe("TemporalField Component", () => {
  const defaultProps = {
    temporalCoverageStartDate: "",
    temporalCoverageEndDate: "",
    temporalCoverageDataType: "",
    updateTemporalCoverage: mockUpdateTemporalCoverage,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render date inputs when temporalCoverageDataType ends with "date"', () => {
    render(
      <TemporalField
        {...defaultProps}
        temporalCoverageDataType="http://www.w3.org/2001/XMLSchema#date"
      />,
    );

    screen.getByLabelText(/Date de Début/i);
    screen.getByLabelText(/Date de Fin/i);
  });

  it('should render NumberInputs when temporalCoverageDataType ends with "Year"', () => {
    render(
      <TemporalField
        {...defaultProps}
        temporalCoverageDataType="http://www.w3.org/2001/XMLSchema#gYear"
      />,
    );

    screen.getByLabelText(/Date de Début/i);
    screen.getByLabelText(/Date de Fin/i);
  });
});
