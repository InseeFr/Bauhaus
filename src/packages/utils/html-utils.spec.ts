// @vitest-environment jsdom
// DOMPurify ≥ 3.4.8 ne reconnaît plus les éléments du DOM happy-dom (balises sûres
// supprimées, <script> conservé) : ce qui passe par DOMPurify se teste sous jsdom.

import { render } from "@testing-library/react";

import * as htmlUtils from "./html-utils";

describe("transform Draft Html to Xhtml", () => {
  it("transform <br> into <br/>", () => {
    const html = `<p>a</p><p><br></p><p>b</p>`;
    expect(htmlUtils.draftHtmlToXhtml(html)).toEqual("<p>a</p><p><br/></p><p>b</p>");
  });
});

describe("build rmes version of html from raw html", () => {
  it("removes insecable spaces (&nbsp;)", () => {
    const html = `<p>Html 1&nbsp;Html 2&nbsp;Html 3</p>`;
    expect(htmlUtils.rawHtmlToRmesHtml(html)).toContain("<p>Html 1 Html 2 Html 3</p>");
  });
  it("adds wrapping `div` and namespace references", () => {
    const html = `<p>Un propriétaire accédant est un propriétaire qui a encore des emprunts à rembourser pour l’achat de sa résidence principale.</p>`;
    expect(htmlUtils.rawHtmlToRmesHtml(html)).toEqual(
      '<div xmlns="http://www.w3.org/1999/xhtml"><p>Un propriétaire accédant est un propriétaire qui a encore des emprunts à rembourser pour l’achat de sa résidence principale.</p></div>',
    );
  });
});

describe("html length", () => {
  it("returns 0 for empty string", () => {
    expect(htmlUtils.htmlLength("")).toEqual(0);
    expect(htmlUtils.htmlLength(undefined as unknown as string)).toEqual(0);
  });
});

describe("html to raw text", () => {
  it("returns an empty string for empty html", () => {
    expect(htmlUtils.htmlToRawText("")).toEqual("");
    expect(htmlUtils.htmlToRawText(undefined as unknown as string)).toEqual("");
  });

  it("returns the text content", () => {
    expect(htmlUtils.htmlToRawText("<p>hello</p>")).toEqual("hello");
  });
});

describe("clean html", () => {
  it("returns an empty string for empty html", () => {
    expect(htmlUtils.cleanHtml("")).toEqual("");
  });

  it("returns the inital html if there is nothing to clean", () => {
    expect(htmlUtils.cleanHtml("<p>bonjour</p>")).toEqual("<p>bonjour</p>");
  });
});

describe("delete p tags", () => {
  it("returns an empty string for empty html", () => {
    expect(htmlUtils.delPTags("")).toEqual("");
  });

  it("returns the text without tags", () => {
    expect(htmlUtils.delPTags("<p>bonjour</p>")).toEqual("bonjour");
  });
});

describe("is empty", () => {
  it("returns true if there is not text content", () => {
    expect(htmlUtils.htmlIsEmpty("")).toBe(true);
    expect(htmlUtils.htmlIsEmpty(undefined as unknown as string)).toBe(true);
  });
});

describe("containUnsupportedStyles", () => {
  it("should return false if the parameter is undefined", () => {
    expect(htmlUtils.containUnsupportedStyles()).toBeFalsy();
  });
  it("should return false if the parameter is valid", () => {
    expect(
      htmlUtils.containUnsupportedStyles({
        key: "value",
      }),
    ).toBeFalsy();
  });
  ["color-rgb(0,0,0)valuecolor-rgb(0,0,0)", "bgcolor-rgb(0,0,0)valuebgcolor-rgb(0,0,0)"].forEach(
    (value) => {
      it(`should return true if the parameter contains one unsupported value (using ${value})`, () => {
        expect(
          htmlUtils.containUnsupportedStyles({
            key: value,
          }),
        ).toBeTruthy();
      });
    },
  );

  it("should return true if the parameter contains two unsupported values", () => {
    expect(
      htmlUtils.containUnsupportedStyles({
        key: "+value+",
        key1: "color-rgb(0,0,0)valuecolor-rgb(0,0,0)",
        key2: "bgcolor-rgb(0,0,0)valuebgcolor-rgb(0,0,0)",
      }),
    ).toBeTruthy();
  });
});

describe("renderMarkdownElement", () => {
  const html = (markdown: string) =>
    render(htmlUtils.renderMarkdownElement(markdown)).container.innerHTML;

  it("renders nothing for a null value", () => {
    expect(htmlUtils.renderMarkdownElement(null as unknown as string)).toBe("");
  });

  it("renders markdown with the engine of the editor", () => {
    const { container } = render(
      htmlUtils.renderMarkdownElement("__gras__ et *ital* `code` ~~barré~~"),
    );

    expect(container.querySelector(".wmde-markdown")).not.toBeNull();
    expect(container.querySelector("strong")?.textContent).toBe("gras");
    expect(container.querySelector("em")?.textContent).toBe("ital");
    expect(container.querySelector("code")?.textContent).toBe("code");
    expect(container.querySelector("del")?.textContent).toBe("barré");
  });

  it("keeps a single line break, as the former editor wrote one line per paragraph", () => {
    const { container } = render(htmlUtils.renderMarkdownElement("ligne 1\nligne 2"));

    expect(container.querySelector("p")?.innerHTML).toBe("ligne 1<br>\nligne 2");
  });

  it("nests sub-lists", () => {
    const { container } = render(htmlUtils.renderMarkdownElement("- un\n  - sous"));

    expect(container.querySelector("ul ul li")?.textContent).toBe("sous");
  });

  it("renders a link", () => {
    const { container } = render(htmlUtils.renderMarkdownElement("[Insee](https://insee.fr)"));

    expect(container.querySelector('a[href="https://insee.fr"]')?.textContent).toBe("Insee");
  });

  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,x"])(
    "does not render a link to %s",
    (url) => {
      expect(html(`[x](${url})`)).not.toMatch(/href="(javascript|data):/i);
    },
  );

  it("renders html as text", () => {
    const { container } = render(
      htmlUtils.renderMarkdownElement('<img src="x" onerror="alert(1)"> <b>x</b>'),
    );

    expect(container.querySelector("img, b")).toBeNull();
    expect(container.textContent).toContain("<b>x</b>");
  });
});

describe("rmesHtmlToRawHtml", () => {
  const XHTML = "http://www.w3.org/1999/xhtml";

  it("removes the wrapping div and its namespace", () => {
    expect(htmlUtils.rmesHtmlToRawHtml(`<div xmlns="${XHTML}"><p>a</p><p>b</p></div>`)).toBe(
      "<p>a</p><p>b</p>",
    );
  });

  it("removes the namespace repeated on inner elements", () => {
    const html = `<div xmlns="http:/www.w3.org/1999/xhtml"><p xmlns="http:/www.w3.org/1999/xhtml">Un propriétaire accédant. </p></div>`;
    expect(htmlUtils.rmesHtmlToRawHtml(html)).toBe("<p>Un propriétaire accédant. </p>");
  });

  it("keeps the note as it is written", () => {
    const html = `<div xmlns="${XHTML}"><p><strong>g</strong> <em>i</em></p><ul><li>a<ul><li>b</li></ul></li></ul></div>`;
    expect(htmlUtils.rmesHtmlToRawHtml(html)).toBe(
      "<p><strong>g</strong> <em>i</em></p><ul><li>a<ul><li>b</li></ul></li></ul>",
    );
  });

  it("keeps a note without wrapping div", () => {
    expect(htmlUtils.rmesHtmlToRawHtml("<p>a</p><p>b</p>")).toBe("<p>a</p><p>b</p>");
  });

  it.each(["", `<div xmlns="${XHTML}"></div>`, `<div xmlns="${XHTML}"><p><br/></p></div>`])(
    "returns an empty string for the empty note %j",
    (html) => {
      expect(htmlUtils.rmesHtmlToRawHtml(html)).toBe("");
    },
  );

  it("writes empty elements in xml form", () => {
    expect(htmlUtils.rmesHtmlToRawHtml('<p>a<br>b<img src="i.png"></p>')).toBe(
      '<p>a<br/>b<img src="i.png"/></p>',
    );
  });

  it("keeps escaped characters escaped", () => {
    expect(htmlUtils.rmesHtmlToRawHtml("<p>&amp; &lt;b&gt;</p>")).toBe("<p>&amp; &lt;b&gt;</p>");
  });

  it("gives back the stored note once wrapped again", () => {
    const stored = `<div xmlns="${XHTML}"><p>Une <strong>note</strong> &amp; <em>liste</em></p><ul><li>a</li></ul><p><br/></p><ol><li>b</li></ol></div>`;
    expect(htmlUtils.rawHtmlToRmesHtml(htmlUtils.rmesHtmlToRawHtml(stored))).toBe(stored);
  });

  it("does not run the handlers of the note", () => {
    using alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    htmlUtils.rmesHtmlToRawHtml('<p><img src="x" onerror="alert(1)"></p>');
    return new Promise((resolve) => setTimeout(resolve, 50)).then(() => {
      expect(alert).not.toHaveBeenCalled();
    });
  });
});
