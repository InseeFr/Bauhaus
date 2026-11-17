// @vitest-environment jsdom
// DOMPurify ≥ 3.4.8 ne reconnaît plus les éléments du DOM happy-dom (balises sûres
// supprimées, <script> conservé) : ce qui passe par DOMPurify se teste sous jsdom.

import { sanitizeHtml } from "./sanitize-html";

describe("sanitizeHtml", () => {
  it("keeps the formatting markup", () => {
    expect(sanitizeHtml("<p><strong>Title</strong> is <em>mandatory</em></p>")).toBe(
      "<p><strong>Title</strong> is <em>mandatory</em></p>",
    );
  });

  it("drops script elements", () => {
    expect(sanitizeHtml("<script>alert(1)</script>text")).toBe("text");
  });

  it("drops event handlers", () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).toBe('<img src="x">');
  });

  it("drops javascript: URLs from links", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).toBe("<a>x</a>");
  });
});
