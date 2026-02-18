import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DdiPreview } from "./DdiPreview";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.loadingDdi": "Chargement du XML DDI...",
        "physicalInstance.view.copyCode": "Copier le code",
        "physicalInstance.view.noDdiXml": "Aucun XML DDI disponible",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("../../../../application/app-context", () => ({
  useAppContext: () => ({
    properties: {
      defaultAgencyId: "fr.insee",
    },
  }),
}));

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  ),
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ value, options, onChange }: any) => (
    <select
      data-testid="format-select"
      value={value}
      onChange={(e) => onChange({ value: e.target.value })}
    >
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("highlight.js/lib/core", () => ({
  default: {
    getLanguage: () => null,
    registerLanguage: vi.fn(),
    highlight: (_code: string) => ({ value: _code }),
  },
}));

vi.mock("highlight.js/lib/languages/xml", () => ({
  default: vi.fn(),
}));

vi.mock("highlight.js/lib/languages/json", () => ({
  default: vi.fn(),
}));

vi.mock("highlight.js/styles/github.css", () => ({}));

vi.mock("./DdiPreview.css", () => ({}));

const mockConvertToDDI3 = vi.fn();

vi.mock("../../../../sdk", () => ({
  DDIApi: {
    convertToDDI3: (...args: any[]) => mockConvertToDDI3(...args),
  },
}));

describe("DdiPreview", () => {
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
    mockConvertToDDI3.mockImplementation(() => new Promise(() => {}));

    render(<DdiPreview {...defaultProps} />);

    expect(screen.getByText("Chargement du XML DDI...")).toBeInTheDocument();
  });

  it("should display DDI 3.3 as default format in the dropdown", () => {
    mockConvertToDDI3.mockImplementation(() => new Promise(() => {}));

    render(<DdiPreview {...defaultProps} />);

    const select = screen.getByTestId("format-select") as HTMLSelectElement;
    expect(select.value).toBe("DDI3");
  });

  it("should show both format options in the dropdown", () => {
    mockConvertToDDI3.mockImplementation(() => new Promise(() => {}));

    render(<DdiPreview {...defaultProps} />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("DDI 3.3");
    expect(options[1]).toHaveTextContent("DDI 4.0/JSON");
  });

  it("should call convertToDDI3 with correct data", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

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

  it("should display XML content after loading in DDI3 mode", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Copier le code")).toBeInTheDocument();
    });
  });

  it("should show error message when loading fails", async () => {
    mockConvertToDDI3.mockRejectedValue(new Error("API Error"));

    render(<DdiPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Aucun XML DDI disponible")).toBeInTheDocument();
    });
  });

  it("should switch to DDI 4.0/JSON format when selecting it", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    const select = screen.getByTestId("format-select") as HTMLSelectElement;
    expect(select.value).toBe("DDI3");

    fireEvent.change(select, { target: { value: "DDI4" } });

    expect(select.value).toBe("DDI4");
  });

  it("should display JSON content in DDI4 mode", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    const select = screen.getByTestId("format-select");
    fireEvent.change(select, { target: { value: "DDI4" } });

    await waitFor(() => {
      const codeElement = document.querySelector(".hljs.language-json");
      expect(codeElement).toBeInTheDocument();
      expect(codeElement?.textContent).toContain('"testVar"');
    });
  });

  it("should include description when provided", async () => {
    const mockXml = '<?xml version="1.0"?><Variable></Variable>';
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

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

    render(<DdiPreview {...defaultProps} isGeographic={true} />);

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
      <DdiPreview {...defaultProps} variableType="text" textRepresentation={textRepresentation} />,
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
});
