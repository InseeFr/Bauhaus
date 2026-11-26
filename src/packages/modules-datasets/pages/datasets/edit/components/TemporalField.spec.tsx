import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import { expectNoBootstrapClass } from "../../../../../tests/bootstrap-classes.testing";
import { TemporalField } from "./TemporalField";

const mockUpdateTemporalCoverage = vi.fn();

// Mock partiel : `initReactI18next` doit rester réel, l'i18n du module est
// initialisé au chargement de son bootstrap.
vi.mock("react-i18next", async (importOriginal) => ({
  ...(await importOriginal()),
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

  it("ne pose aucune classe Bootstrap", () => {
    render(
      <TemporalField
        {...defaultProps}
        temporalCoverageDataType="http://www.w3.org/2001/XMLSchema#gYear"
      />,
    );
    expectNoBootstrapClass();
  });

  it("ne pose aucune classe Bootstrap sur les dates", () => {
    render(
      <TemporalField
        {...defaultProps}
        temporalCoverageDataType="http://www.w3.org/2001/XMLSchema#date"
      />,
    );
    expectNoBootstrapClass();
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
