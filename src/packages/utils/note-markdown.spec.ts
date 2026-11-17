import { markdownToNoteHtml, noteHtmlToMarkdown } from "./note-markdown";

describe("noteHtmlToMarkdown", () => {
  it.each([
    ["", ""],
    ["<p>texte</p>", "texte"],
    ["<p>a</p><p>b</p>", "a\n\nb"],
    ["<p><strong>g</strong> et <em>i</em></p>", "**g** et *i*"],
    ["<ul><li>a</li><li>b</li></ul>", "* a\n* b"],
    ["<ol><li>a</li><li>b</li></ol>", "1. a\n2. b"],
    ["<ul><li>a<ul><li>b</li></ul></li></ul>", "* a\n  * b"],
    ['<p><a href="https://insee.fr">Insee</a></p>', "[Insee](https://insee.fr)"],
    ["<p>a<br/>b</p>", "a\\\nb"],
    ["<p>2 * 3 _x_ #1</p>", "2 \\* 3 \\_x\\_ #1"],
  ])("converts %j", (html, markdown) => {
    expect(noteHtmlToMarkdown(html)).toBe(markdown);
  });

  it("drops empty lines", () => {
    expect(noteHtmlToMarkdown("<p>a</p><p><br/></p><p>b</p>")).toBe("a\n\nb");
  });

  it("keeps the text of an unsupported markup", () => {
    expect(noteHtmlToMarkdown('<p><u>souligné</u> <span style="color:red">rouge</span></p>')).toBe(
      "souligné rouge",
    );
  });
});

describe("markdownToNoteHtml", () => {
  it.each([
    ["", ""],
    ["texte", "<p>texte</p>"],
    ["a\n\nb", "<p>a</p><p>b</p>"],
    ["**g** et *i*", "<p><strong>g</strong> et <em>i</em></p>"],
    ["- a\n- b", "<ul><li>a</li><li>b</li></ul>"],
    ["1. a\n2. b", "<ol><li>a</li><li>b</li></ol>"],
    ["- a\n  - b", "<ul><li>a<ul><li>b</li></ul></li></ul>"],
    ["[Insee](https://insee.fr)", '<p><a href="https://insee.fr">Insee</a></p>'],
    ["a\\\nb", "<p>a<br/>b</p>"],
    ["2 \\* 3", "<p>2 * 3</p>"],
  ])("converts %j", (markdown, html) => {
    expect(markdownToNoteHtml(markdown)).toBe(html);
  });

  it("escapes the text as xml", () => {
    expect(markdownToNoteHtml("a & b < c")).toBe("<p>a &amp; b &lt; c</p>");
  });

  it("renders html typed in the editor as text", () => {
    expect(markdownToNoteHtml('<img src="x" onerror="alert(1)">')).toBe(
      '<p>&lt;img src="x" onerror="alert(1)"&gt;</p>',
    );
  });

  it.each(["javascript:alert(1)", "data:text/html,x"])(
    "keeps only the text of a link to %s",
    (url) => {
      expect(markdownToNoteHtml(`[x](${url})`)).toBe("<p>x</p>");
    },
  );
});

describe("round trip", () => {
  it.each([
    "<p>Une <strong>note</strong> avec <em>italique</em>.</p>",
    "<ul><li>a</li><li>b<ol><li>c</li></ol></li></ul><p>fin</p>",
    '<p>Voir <a href="https://www.insee.fr/fr/metadonnees">le site</a> &amp; la suite.</p>',
  ])("gives back %j", (html) => {
    expect(markdownToNoteHtml(noteHtmlToMarkdown(html))).toBe(html);
  });
});
