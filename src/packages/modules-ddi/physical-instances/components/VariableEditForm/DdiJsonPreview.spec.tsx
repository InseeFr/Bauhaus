import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DdiJsonPreview } from "./DdiJsonPreview";

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
  useHighlight: (code: string) => `<span class="hljs-attr">${code}</span>`,
}));

vi.mock("./DdiPreview.css", () => ({}));

describe("DdiJsonPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn() },
      writable: true,
      configurable: true,
    });
  });

  it("should render the copy button", () => {
    render(<DdiJsonPreview code='{"key":"value"}' />);

    expect(screen.getByText("Copier le code")).toBeInTheDocument();
  });

  it("should render highlighted JSON in a code element", () => {
    render(<DdiJsonPreview code='{"key":"value"}' />);

    const codeElement = document.querySelector(".hljs.language-json");
    expect(codeElement).toBeInTheDocument();
    expect(codeElement?.querySelector(".hljs-attr")).toBeInTheDocument();
  });

  it("should copy code to clipboard when clicking the copy button", () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });
    render(<DdiJsonPreview code='{"key":"value"}' />);

    fireEvent.click(screen.getByText("Copier le code"));

    expect(writeText).toHaveBeenCalledWith('{"key":"value"}');
  });

  it("should render with ddi-preview-code-container class", () => {
    const { container } = render(<DdiJsonPreview code='{"key":"value"}' />);

    expect(container.querySelector(".ddi-preview-code-container")).toBeInTheDocument();
  });

  it("should render pre with ddi-preview-code class", () => {
    const { container } = render(<DdiJsonPreview code='{"key":"value"}' />);

    expect(container.querySelector("pre.ddi-preview-code")).toBeInTheDocument();
  });
});
