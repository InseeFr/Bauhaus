import { mdToDraftjs } from "./mdToDraftjs";

describe("mdToDraftjs", () => {
  it("should manage [ ] without content without styles", () => {
    expect(mdToDraftjs("content [1]")).toEqual({
      blocks: [
        {
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
          text: "content [1]",
          type: "unstyled",
        },
      ],
      entityMap: {
        data: "",
        mutability: "",
        type: "",
      },
    });
  });

  it("should manage [ ] without content with styles", () => {
    expect(mdToDraftjs("content [*1*]")).toEqual({
      blocks: [
        {
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [
            {
              length: 1,
              offset: 9,
              style: "ITALIC",
            },
          ],
          text: "content [1]",
          type: "unstyled",
        },
      ],
      entityMap: {
        data: "",
        mutability: "",
        type: "",
      },
    });
  });

  it.each(["https://insee.fr", "http://insee.fr", "HTTPS://insee.fr"])(
    "should keep a link to %s",
    (url) => {
      const { blocks, entityMap } = mdToDraftjs(`[x](${url})`);

      expect(blocks[0].entityRanges).toEqual([{ key: 0, length: 1, offset: 0 }]);
      expect(entityMap).toHaveProperty("0", { type: "LINK", mutability: "MUTABLE", data: { url } });
    },
  );

  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,x", "mailto:a@b.fr"])(
    "should keep only the text of a link to %s",
    (url) => {
      const { blocks } = mdToDraftjs(`[x](${url})`);

      expect(blocks[0].text).toBe("x");
      expect(blocks[0].entityRanges).toEqual([]);
    },
  );
});
