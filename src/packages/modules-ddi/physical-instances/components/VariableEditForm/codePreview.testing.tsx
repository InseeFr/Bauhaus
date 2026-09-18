import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Doublures de `react-i18next` et `primereact/button` pour les aperçus de code :
 * `vi.mock("react-i18next", () => import("./codePreview.testing"));`
 */
export const useTranslation = () => ({
  t: (key: string) => (key === "physicalInstance.view.copyCode" ? "Copier le code" : key),
});

export const Button = ({ label, onClick, className }: any) => (
  <button onClick={onClick} className={className}>
    {label}
  </button>
);

/** Module `./useHighlight` qui entoure le code d'un span portant `className`. */
export const highlightModule = (className: string) => ({
  useHighlight: (code: string) => `<span class="${className}">${code}</span>`,
});

/** Installe un presse-papiers factice et renvoie son `writeText`. */
export const mockClipboard = (writeText = vi.fn()) => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    writable: true,
    configurable: true,
  });
  return writeText;
};

interface CodePreviewSuite {
  Preview: ComponentType<{ code: string }>;
  code: string;
  language: "json" | "xml";
  /** Classe posée par le `useHighlight` mocké de la spec. */
  highlightClass: string;
}

/** Comportement commun des aperçus de code coloré (DDI JSON, DDI XML). */
export const describeCodePreview = (
  name: string,
  { Preview, code, language, highlightClass }: CodePreviewSuite,
) =>
  describe(name, () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockClipboard();
    });

    it("should render the copy button", () => {
      render(<Preview code={code} />);

      expect(screen.getByText("Copier le code")).toBeInTheDocument();
    });

    it(`should render highlighted ${language.toUpperCase()} in a code element`, () => {
      render(<Preview code={code} />);

      const codeElement = document.querySelector(`.hljs.language-${language}`);
      expect(codeElement).toBeInTheDocument();
      expect(codeElement?.querySelector(`.${highlightClass}`)).toBeInTheDocument();
    });

    it("should copy code to clipboard when clicking the copy button", () => {
      const writeText = mockClipboard();
      render(<Preview code={code} />);

      fireEvent.click(screen.getByText("Copier le code"));

      expect(writeText).toHaveBeenCalledWith(code);
    });

    it("should render with ddi-preview-code-container class", () => {
      const { container } = render(<Preview code={code} />);

      expect(container.querySelector(".ddi-preview-code-container")).toBeInTheDocument();
    });

    it("should render pre with ddi-preview-code class", () => {
      const { container } = render(<Preview code={code} />);

      expect(container.querySelector("pre.ddi-preview-code")).toBeInTheDocument();
    });
  });
