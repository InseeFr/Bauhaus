import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import { ExportButtons } from "./ExportButtons";

const translations: Record<string, string> = {
  "common.btnOdsExporter": "Exporter en ODS",
  "common.btnOdtLg1Exporter": "Exporter en ODT (Première langue)",
  "common.btnOdtLg2Exporter": "Exporter en ODT (Seconde langue)",
  "common.btnCollectionConceptExporter": "Exporter les fiches des concepts de la sélection",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] ?? key,
  }),
}));

describe("ExportButtons Component", () => {
  it("should render all buttons with the correct labels", () => {
    render(<ExportButtons exportHandler={vi.fn()} disabled={false} />);

    screen.getByText(translations["common.btnOdsExporter"]);
    screen.getByText(translations["common.btnOdtLg1Exporter"]);
    screen.getByText(translations["common.btnOdtLg2Exporter"]);
    screen.getByText(translations["common.btnCollectionConceptExporter"]);
  });

  it("should call exportHandler with correct arguments when buttons are clicked", () => {
    const mockExportHandler = vi.fn();

    render(<ExportButtons exportHandler={mockExportHandler} disabled={false} />);

    fireEvent.click(screen.getByText(translations["common.btnOdsExporter"]));
    expect(mockExportHandler).toHaveBeenCalledWith("ods", false);

    fireEvent.click(screen.getByText(translations["common.btnOdtLg1Exporter"]));
    expect(mockExportHandler).toHaveBeenCalledWith("odt", false);

    fireEvent.click(screen.getByText(translations["common.btnOdtLg2Exporter"]));
    expect(mockExportHandler).toHaveBeenCalledWith("odt", false, "lg2");

    fireEvent.click(screen.getByText(translations["common.btnCollectionConceptExporter"]));
    expect(mockExportHandler).toHaveBeenCalledWith("odt", true);
  });

  it("should disable buttons when disabled is true", () => {
    render(<ExportButtons exportHandler={vi.fn()} disabled={true} />);

    const button = screen.getByText("Export") as HTMLButtonElement;
    expect(button.getAttribute("disabled")).toBeDefined();
  });

  it("should enable buttons when disabled is false", () => {
    render(<ExportButtons exportHandler={vi.fn()} disabled={false} />);

    const button = screen.getByText("Export") as HTMLButtonElement;
    expect(button.getAttribute("disabled")).toBeNull();
  });
});
