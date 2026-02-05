import { parse } from "@textlint/markdown-to-ast";

const defaultInlineStyles = {
  Strong: {
    type: "BOLD",
    symbol: "__",
  },
  Emphasis: {
    type: "ITALIC",
    symbol: "*",
  },
};
export const REGEXPS = [
  {
    regexp: /((bg)?color-rgb\(\d*,\d*,\d*\))/,
  },
];

const defaultBlockStyles = {
  List: "unordered-list-item",
  Header1: "header-one",
  Header2: "header-two",
  Header3: "header-three",
  Header4: "header-four",
  Header5: "header-five",
  Header6: "header-six",
  CodeBlock: "code-block",
  BlockQuote: "blockquote",
};

const getBlockStyleForMd = (node: any, blockStyles: any) => {
  const style = node.type;
  const ordered = node.ordered;
  const depth = node.depth;
  if (style === "List" && ordered) {
    return "ordered-list-item";
  } else if (style === "Header") {
    return blockStyles[`${style}${depth}`];
  } else if (
    node.type === "Paragraph" &&
    node.children &&
    node.children[0] &&
    node.children[0].type === "Image"
  ) {
    return "atomic";
  } else if (node.type === "Paragraph" && node.raw && node.raw.match(/^\[\[\s\S+\s.*\S+\s\]\]/)) {
    return "atomic";
  }
  return blockStyles[style];
};

const joinCodeBlocks = (splitMd: string[]): any => {
  const opening = splitMd.indexOf("```");
  const closing = splitMd.indexOf("```", opening + 1);

  if (opening >= 0 && closing >= 0) {
    const codeBlock = splitMd.slice(opening, closing + 1);
    const codeBlockJoined = codeBlock.join("\n");
    const updatedSplitMarkdown = [
      ...splitMd.slice(0, opening),
      codeBlockJoined,
      ...splitMd.slice(closing + 1),
    ];

    return joinCodeBlocks(updatedSplitMarkdown);
  }

  return splitMd;
};

const splitMdBlocks = (md: string) => {
  const splitMd = md.split("\n");

  // Process the split markdown include the
  // one syntax where there's an block level opening
  // and closing symbol with content in the middle.
  const splitMdWithCodeBlocks = joinCodeBlocks(splitMd);
  return splitMdWithCodeBlocks;
};

const parseMdLine = (line: any, existingEntities: any, extraStyles: any = {}) => {
  const inlineStyles = { ...defaultInlineStyles, ...extraStyles.inlineStyles };
  const blockStyles = { ...defaultBlockStyles, ...extraStyles.blockStyles };

  const astString: any = parse(line);
  let text = "";
  const inlineStyleRanges: any[] = [];
  const entityRanges: any[] = [];
  const entityMap = existingEntities;

  const addInlineStyleRange = (offset: any, length: any, style: any) => {
    inlineStyleRanges.push({ offset, length, style });
  };

  const getRawLength = (children: any) =>
    children.reduce(
      (prev: any, current: any) => prev + (current.value ? current.value.length : 0),
      0,
    );

  const addLink = (child: any) => {
    const entityKey = Object.keys(entityMap).length;
    entityMap[entityKey] = {
      type: "LINK",
      mutability: "MUTABLE",
      data: {
        url: child.url,
      },
    };
    entityRanges.push({
      key: entityKey,
      length: getRawLength(child.children),
      offset: text.length,
    });
  };

  const addImage = (child: any) => {
    const entityKey = Object.keys(entityMap).length;
    entityMap[entityKey] = {
      type: "IMAGE",
      mutability: "IMMUTABLE",
      data: {
        url: child.url,
        src: child.url,
        fileName: child.alt || "",
      },
    };
    entityRanges.push({
      key: entityKey,
      length: 1,
      offset: text.length,
    });
  };

  const addVideo = (child: any) => {
    const string = child.raw;

    // RegEx: [[ embed url=<anything> ]]
    const url = string.match(/^\[\[\s(?:embed)\s(?:url=(\S+))\s\]\]/)[1];

    const entityKey = Object.keys(entityMap).length;
    entityMap[entityKey] = {
      type: "draft-js-video-plugin-video",
      mutability: "IMMUTABLE",
      data: {
        src: url,
      },
    };
    entityRanges.push({
      key: entityKey,
      length: 1,
      offset: text.length,
    });
  };

  const parseChildren = (child: any, style: any) => {
    // RegEx: [[ embed url=<anything> ]]
    const videoShortcodeRegEx = /^\[\[\s(?:embed)\s(?:url=(\S+))\s\]\]/;
    switch (child.type) {
      case "Link":
        addLink(child);
        break;
      case "Image":
        addImage(child);
        break;
      case "Paragraph":
        if (videoShortcodeRegEx.test(child.raw)) {
          addVideo(child);
        }
        break;
      default:
    }

    const shouldManagerSubChildren = !videoShortcodeRegEx.test(child.raw);
    if (shouldManagerSubChildren && child.children) {
      if (child.type === "LinkReference") {
        text += "[";
      }
      if (style) {
        const rawLength = getRawLength(child.children);
        addInlineStyleRange(text.length, rawLength, style.type);
      }
      const newStyle = inlineStyles[child.type];
      child.children.forEach((grandChild: any) => {
        parseChildren(grandChild, newStyle);
      });

      if (child.type === "LinkReference") {
        text += "]";
      }
    } else {
      if (style) {
        addInlineStyleRange(text.length, child.value.length, style.type);
      }
      if (inlineStyles[child.type]) {
        addInlineStyleRange(text.length, child.value.length, inlineStyles[child.type].type);
      }

      if (child.type === "Str" || child.type === "LinkReference") {
        const value = child.type === "LinkReference" ? child.raw : child.value;
        let i = 0;
        let startIndex = null;
        let finalText = "";

        const REGEXPS = [
          {
            regexp: /^((bg)?color-rgb\(\d*,\d*,\d*\))/,
          },
        ];

        let removedSymbolLength = 0;
        const regexpPredicate = (reg: any) => reg.regexp.test(value.substr(i));
        while (i < value.length) {
          const regexpConfig: any = REGEXPS.find(regexpPredicate);
          if (regexpConfig) {
            const matches = value.substr(i).match(regexpConfig.regexp);
            const symbol = matches[1];
            if (startIndex === null) {
              startIndex = i + text.length - removedSymbolLength;
              i += symbol.length - 1;
            } else {
              addInlineStyleRange(
                startIndex,
                i - startIndex - symbol.length - removedSymbolLength + text.length,
                regexpConfig.type || symbol,
              );
              removedSymbolLength += symbol.length * 2;

              startIndex = null;
              i += symbol.length - 1;
            }
          } else {
            finalText += value[i];
          }

          i++;
        }

        text = `${text}${finalText}`;
      } else {
        text = `${text}${
          child.type === "Image" || videoShortcodeRegEx.test(child.raw) ? " " : child.value
        }`;
      }
    }
  };

  astString.children.forEach((child: any) => {
    const style = inlineStyles[child.type];
    parseChildren(child, style);
  });

  // add block style if it exists
  let blockStyle = "unstyled";
  if (astString.children[0]) {
    const style = getBlockStyleForMd(astString.children[0], blockStyles);
    if (style) {
      blockStyle = style;
    }
  }

  return {
    text,
    inlineStyleRanges,
    entityRanges,
    blockStyle,
    entityMap,
  };
};

export function mdToDraftjs(mdString: any, extraStyles?: any) {
  const paragraphs: any[] = splitMdBlocks(mdString);
  const blocks: any[] = [];
  let entityMap = {};
  paragraphs.forEach((paragraph: any) => {
    const result = parseMdLine(paragraph, entityMap, extraStyles);
    blocks.push({
      text: result.text,
      type: result.blockStyle,
      depth: 0,
      inlineStyleRanges: result.inlineStyleRanges,
      entityRanges: result.entityRanges,
    });
    entityMap = result.entityMap;
  });

  // add a default value
  // not sure why that's needed but Draftjs convertToRaw fails without it
  if (Object.keys(entityMap).length === 0) {
    entityMap = {
      data: "",
      mutability: "",
      type: "",
    };
  }
  return {
    blocks,
    entityMap,
  };
}
