import { render, screen, fireEvent } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DdiJsonPreview } from "./DdiJsonPreview";

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
    highlight.pending ? null : `<span class="hljs-attr">${code}</span>`,
}));

vi.mock("./DdiPreview.css", () => ({}));

describe("DdiJsonPreview", () => {
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
    render(<DdiJsonPreview code='{"key":"value"}' fileName="preview.json" />);

    expect(screen.getByText("Copier le code")).toBeInTheDocument();
  });

  it("should render highlighted JSON in a code element", () => {
    render(<DdiJsonPreview code='{"key":"value"}' fileName="preview.json" />);

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
    render(<DdiJsonPreview code='{"key":"value"}' fileName="preview.json" />);

    fireEvent.click(screen.getByText("Copier le code"));

    expect(writeText).toHaveBeenCalledWith('{"key":"value"}');
  });

  it("should render with ddi-preview-code-container class", () => {
    const { container } = render(<DdiJsonPreview code='{"key":"value"}' fileName="preview.json" />);

    expect(container.querySelector(".ddi-preview-code-container")).toBeInTheDocument();
  });

  it("should render pre with ddi-preview-code class", () => {
    const { container } = render(<DdiJsonPreview code='{"key":"value"}' fileName="preview.json" />);

    expect(container.querySelector("pre.ddi-preview-code")).toBeInTheDocument();
  });

  it("should display the raw code as text, not as HTML, while it is not highlighted", () => {
    highlight.pending = true;
    const code = '{"label":"<b>gras</b>"}';

    const { container } = render(<DdiJsonPreview code={code} fileName="preview.json" />);

    const codeElement = container.querySelector("pre.ddi-preview-code code");
    expect(codeElement?.textContent).toBe(code);
    expect(codeElement?.children).toHaveLength(0);
  });

  it("should not submit the enclosing form when clicking the copy button", () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <DdiJsonPreview code={'{"key":"value"}'} fileName="preview.json" />
      </form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copier le code" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should download the whole code of a document over 4 MiB as a file", async () => {
    using createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview");
    using _revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    using click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const code = `{"key": "${"a".repeat(4 * 1024 * 1024)}"}`;

    render(<DdiJsonPreview code={code} fileName="testvar-ddi4.json" />);
    fireEvent.click(screen.getByRole("button", { name: "Télécharger" }));

    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(await blob.text()).toBe(code);
    const link = click.mock.contexts[0] as HTMLAnchorElement;
    expect(link.download).toBe("testvar-ddi4.json");
    expect(link.getAttribute("href")).toBe("blob:preview");
  });

  it("should warn on the copy button that a document over 4 MiB may be truncated", async () => {
    render(<DdiJsonPreview code={"a".repeat(4 * 1024 * 1024 + 1)} fileName="preview.json" />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Copier le code" }));

    expect(
      await screen.findByText("Document trop volumineux pour certains navigateurs"),
    ).toBeInTheDocument();
  });

  it("should not warn on the copy button for a document under 4 MiB", async () => {
    render(<DdiJsonPreview code={"a".repeat(4 * 1024 * 1024)} fileName="preview.json" />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Copier le code" }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(
      screen.queryByText("Document trop volumineux pour certains navigateurs"),
    ).not.toBeInTheDocument();
  });

  it("should not offer the download for a document under 4 MiB", () => {
    render(<DdiJsonPreview code={"a".repeat(4 * 1024 * 1024)} fileName="preview.json" />);

    expect(screen.queryByRole("button", { name: "Télécharger" })).not.toBeInTheDocument();
  });
});
