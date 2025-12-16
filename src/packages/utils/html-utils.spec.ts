import * as htmlUtils from "./html-utils";

describe("build raw html from rmes version of html", () => {
  it("removes wrapping `div` and namespace references", () => {
    const html = `<div xmlns="http:/www.w3.org/1999/xhtml"><p xmlns="http:/www.w3.org/1999/xhtml">Un propriétaire accédant est un propriétaire qui a encore des emprunts à rembourser pour l’achat de sa résidence principale. </p></div>`;
    expect(htmlUtils.rmesHtmlToRawHtml(html)).toEqual(
      "<p>Un propriétaire accédant est un propriétaire qui a encore des emprunts à rembourser pour l’achat de sa résidence principale.</p>",
    );
  });
});

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
