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
});
