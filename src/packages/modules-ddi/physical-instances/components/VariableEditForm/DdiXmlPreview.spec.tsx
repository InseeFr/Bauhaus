import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DdiXmlPreview } from "./DdiXmlPreview";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.copyCode": "Copier le code",
      };
      return translations[key] || key;
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

vi.mock("./useHighlight", () => ({
  useHighlight: (code: string) => `<span class="hljs-tag">${code}</span>`,
}));

vi.mock("./DdiPreview.css", () => ({}));

describe("DdiXmlPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn() },
      writable: true,
      configurable: true,
    });
  });

  it("should render the copy button", () => {
    render(<DdiXmlPreview code="<root/>" />);

    expect(screen.getByText("Copier le code")).toBeInTheDocument();
  });

  it("should render highlighted XML in a code element", () => {
    render(<DdiXmlPreview code="<root/>" />);

    const codeElement = document.querySelector(".hljs.language-xml");
    expect(codeElement).toBeInTheDocument();
    expect(codeElement?.querySelector(".hljs-tag")).toBeInTheDocument();
  });

  it("should copy code to clipboard when clicking the copy button", () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });
    render(<DdiXmlPreview code="<root/>" />);

    fireEvent.click(screen.getByText("Copier le code"));

    expect(writeText).toHaveBeenCalledWith("<root/>");
  });

  it("should render with ddi-preview-code-container class", () => {
    const { container } = render(<DdiXmlPreview code="<root/>" />);

    expect(container.querySelector(".ddi-preview-code-container")).toBeInTheDocument();
  });

  it("should render pre with ddi-preview-code class", () => {
    const { container } = render(<DdiXmlPreview code="<root/>" />);

    expect(container.querySelector("pre.ddi-preview-code")).toBeInTheDocument();
  });
});
