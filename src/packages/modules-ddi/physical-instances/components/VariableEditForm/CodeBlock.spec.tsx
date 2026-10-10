import { configure, render, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { withScreenLayout } from "../CodeRepresentation/virtualScrollerLayout.testing";
import { CodeBlock, VIRTUALIZATION_THRESHOLD } from "./CodeBlock";

// Vrais VirtualScroller et highlight.js : c'est le rendu effectif qui est vérifié. Le chunk
// highlight.js chargé à froid peut dépasser la seconde par défaut de `waitFor`.
const DEFAULT_ASYNC_UTIL_TIMEOUT = 1000;
beforeAll(() => configure({ asyncUtilTimeout: 15000 }));
afterAll(() => configure({ asyncUtilTimeout: DEFAULT_ASYNC_UTIL_TIMEOUT }));

const xmlOfLines = (count: number) =>
  Array.from({ length: count }, (_, index) => `  <r:Code id="code-${index}"/>`).join("\n");

describe("CodeBlock", () => {
  it("renders only a window of the lines of a very large code", () => {
    using _layout = withScreenLayout();
    const lineCount = VIRTUALIZATION_THRESHOLD * 5;

    render(<CodeBlock code={xmlOfLines(lineCount)} language="xml" />);

    expect(screen.getByText('<r:Code id="code-0"/>', { exact: false })).toBeInTheDocument();
    const renderedLines = document.querySelectorAll(".ddi-preview-line");
    expect(renderedLines.length).toBeGreaterThan(0);
    expect(renderedLines.length).toBeLessThan(lineCount);
  });

  it("highlights the rendered lines of a very large code", async () => {
    using _layout = withScreenLayout();

    render(<CodeBlock code={xmlOfLines(VIRTUALIZATION_THRESHOLD * 5)} language="xml" />);

    await waitFor(() => {
      expect(document.querySelector(".ddi-preview-line .hljs-tag")).toBeInTheDocument();
    });
  });

  it("keeps the leading indentation of each line", () => {
    using _layout = withScreenLayout();

    render(<CodeBlock code={xmlOfLines(VIRTUALIZATION_THRESHOLD * 5)} language="xml" />);

    expect(document.querySelector(".ddi-preview-line")?.textContent).toBe(
      '  <r:Code id="code-0"/>',
    );
  });

  it("renders a small code whole, in a single block", () => {
    const code = xmlOfLines(3);

    const { container } = render(<CodeBlock code={code} language="xml" />);

    expect(container.querySelector("pre.ddi-preview-code code")?.textContent).toBe(code);
    expect(container.querySelector(".ddi-preview-line")).not.toBeInTheDocument();
  });
});
