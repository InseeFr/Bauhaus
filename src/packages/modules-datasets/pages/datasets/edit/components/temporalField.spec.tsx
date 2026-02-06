import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import { TemporalField } from "./temporalField";

const mockUpdateTemporalCoverage = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "dataset.statisticalInformation.temporalCoverage.startDate": "Date de début",
        "dataset.statisticalInformation.temporalCoverage.endDate": "Date de fin",
      };
      return translations[key] || key;
    },
  }),
}));

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
