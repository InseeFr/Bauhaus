import { render, screen, fireEvent } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DdiXmlPreview } from "./DdiXmlPreview";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.copyCode": "Copier le code",
        "physicalInstance.view.downloadCode": "Télécharger",
        "physicalInstance.view.copyCodeTooLarge":
          "Document trop volumineux pour certains navigateurs",
      };
      return translations[key] || key;
    },
  }),
}));

const highlight = vi.hoisted(() => ({ pending: false }));

vi.mock("./useHighlight", () => ({
  useHighlight: (code: string) =>
    highlight.pending ? null : `<span class="hljs-tag">${code}</span>`,
}));

vi.mock("./DdiPreview.css", () => ({}));

describe("DdiXmlPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    highlight.pending = false;
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn() },
      writable: true,
      configurable: true,
    });
  });

  it("should render the copy button", () => {
    render(<DdiXmlPreview code="<root/>" fileName="preview.xml" />);

    expect(screen.getByText("Copier le code")).toBeInTheDocument();
  });

  it("should render highlighted XML in a code element", () => {
    render(<DdiXmlPreview code="<root/>" fileName="preview.xml" />);

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
    render(<DdiXmlPreview code="<root/>" fileName="preview.xml" />);

    fireEvent.click(screen.getByText("Copier le code"));

    expect(writeText).toHaveBeenCalledWith("<root/>");
  });

  it("should render with ddi-preview-code-container class", () => {
    const { container } = render(<DdiXmlPreview code="<root/>" fileName="preview.xml" />);

    expect(container.querySelector(".ddi-preview-code-container")).toBeInTheDocument();
  });

  it("should render pre with ddi-preview-code class", () => {
    const { container } = render(<DdiXmlPreview code="<root/>" fileName="preview.xml" />);

    expect(container.querySelector("pre.ddi-preview-code")).toBeInTheDocument();
  });

  it("should display the raw code as text, not as HTML, while it is not highlighted", () => {
    highlight.pending = true;
    const code = "<root><child>texte</child></root>";

    const { container } = render(<DdiXmlPreview code={code} fileName="preview.xml" />);

    const codeElement = container.querySelector("pre.ddi-preview-code code");
    expect(codeElement?.textContent).toBe(code);
    expect(codeElement?.children).toHaveLength(0);
  });

  it("should not submit the enclosing form when clicking the copy button", () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <DdiXmlPreview code={"<root/>"} fileName="preview.xml" />
      </form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copier le code" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should download the whole code of a document over 4 MiB as a file", async () => {
    using createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview");
    using _revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    using click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const code = `<root>${"a".repeat(4 * 1024 * 1024)}</root>`;

    render(<DdiXmlPreview code={code} fileName="testvar-ddi3.xml" />);
    fireEvent.click(screen.getByRole("button", { name: "Télécharger" }));

    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(await blob.text()).toBe(code);
    const link = click.mock.contexts[0] as HTMLAnchorElement;
    expect(link.download).toBe("testvar-ddi3.xml");
    expect(link.getAttribute("href")).toBe("blob:preview");
  });

  it("should warn on the copy button that a document over 4 MiB may be truncated", async () => {
    render(<DdiXmlPreview code={"a".repeat(4 * 1024 * 1024 + 1)} fileName="preview.xml" />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Copier le code" }));

    expect(
      await screen.findByText("Document trop volumineux pour certains navigateurs"),
    ).toBeInTheDocument();
  });

  it("should not warn on the copy button for a document under 4 MiB", async () => {
    render(<DdiXmlPreview code={"a".repeat(4 * 1024 * 1024)} fileName="preview.xml" />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Copier le code" }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(
      screen.queryByText("Document trop volumineux pour certains navigateurs"),
    ).not.toBeInTheDocument();
  });

  it("should not offer the download for a document under 4 MiB", () => {
    render(<DdiXmlPreview code={"a".repeat(4 * 1024 * 1024)} fileName="preview.xml" />);

    expect(screen.queryByRole("button", { name: "Télécharger" })).not.toBeInTheDocument();
  });
});
