import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DdiXmlPreview } from "./DdiXmlPreview";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.loadingDdi": "Chargement du XML DDI...",
        "physicalInstance.view.copyXml": "Copier le XML",
        "physicalInstance.view.noDdiXml": "Aucun XML DDI disponible",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick }: any) => <button onClick={onClick}>{label}</button>,
}));

vi.mock("primereact/inputtextarea", () => ({
  InputTextarea: ({ value, readOnly, rows, style }: any) => (
    <textarea
      value={value}
      readOnly={readOnly}
      rows={rows}
      style={style}
      data-testid="xml-textarea"
    />
  ),
}));

const mockConvertToDDI3 = vi.fn();

vi.mock("../../../../sdk", () => ({
  DDIApi: {
    convertToDDI3: (...args: any[]) => mockConvertToDDI3(...args),
  },
}));

describe("DdiXmlPreview", () => {
  const defaultProps = {
    variableId: "var-1",
    variableName: "testVar",
    variableLabel: "Test Variable",
    variableDescription: "Test description",
    variableType: "text",
    isGeographic: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  it("should show loading state initially", () => {
    mockConvertToDDI3.mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<DdiXmlPreview {...defaultProps} />);

    expect(screen.getByText("Chargement du XML DDI...")).toBeInTheDocument();
  });

  it("should call convertToDDI3 with correct data", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiXmlPreview {...defaultProps} />);

    await waitFor(() => {
      expect(mockConvertToDDI3).toHaveBeenCalledWith(
        expect.objectContaining({
          Variable: expect.arrayContaining([
            expect.objectContaining({
              ID: "var-1",
              VariableName: {
                String: {
                  "@xml:lang": "fr-FR",
                  "#text": "testVar",
                },
              },
              Label: {
                Content: {
                  "@xml:lang": "fr-FR",
                  "#text": "Test Variable",
                },
              },
            }),
          ]),
        }),
      );
    });
  });

  it("should display formatted XML after loading", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiXmlPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("xml-textarea")).toBeInTheDocument();
    });

    const textarea = screen.getByTestId("xml-textarea") as HTMLTextAreaElement;
    expect(textarea.value).toContain('<?xml version="1.0"?>');
    expect(textarea.value).toContain("<Variable>");
  });

  it("should show copy button when XML is loaded", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiXmlPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Copier le XML")).toBeInTheDocument();
    });
  });

  it("should show error message when loading fails", async () => {
    mockConvertToDDI3.mockRejectedValue(new Error("API Error"));

    render(<DdiXmlPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Aucun XML DDI disponible")).toBeInTheDocument();
    });
  });

  it("should include description when provided", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiXmlPreview {...defaultProps} />);

    await waitFor(() => {
      expect(mockConvertToDDI3).toHaveBeenCalledWith(
        expect.objectContaining({
          Variable: expect.arrayContaining([
            expect.objectContaining({
              Description: {
                Content: {
                  "@xml:lang": "fr-FR",
                  "#text": "Test description",
                },
              },
            }),
          ]),
        }),
      );
    });
  });

  it("should include geographic attribute when isGeographic is true", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiXmlPreview {...defaultProps} isGeographic={true} />);

    await waitFor(() => {
      expect(mockConvertToDDI3).toHaveBeenCalledWith(
        expect.objectContaining({
          Variable: expect.arrayContaining([
            expect.objectContaining({
              "@isGeographic": "true",
            }),
          ]),
        }),
      );
    });
  });

  it("should include TextRepresentation when type is text", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    const textRepresentation = { "@maxLength": "100" };

    render(
      <DdiXmlPreview
        {...defaultProps}
        variableType="text"
        textRepresentation={textRepresentation}
      />,
    );

    await waitFor(() => {
      expect(mockConvertToDDI3).toHaveBeenCalledWith(
        expect.objectContaining({
          Variable: expect.arrayContaining([
            expect.objectContaining({
              VariableRepresentation: expect.objectContaining({
                VariableRole: "Mesure",
                TextRepresentation: textRepresentation,
              }),
            }),
          ]),
        }),
      );
    });
  });

  it("should format XML with proper indentation", async () => {
    const mockXml = "<root><child><nested>value</nested></child></root>";
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiXmlPreview {...defaultProps} />);

    await waitFor(() => {
      const textarea = screen.getByTestId("xml-textarea") as HTMLTextAreaElement;
      // Check that the XML has line breaks (indicating formatting)
      expect(textarea.value).toContain("\n");
    });
  });
});
