//@ts-ignore
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Options, stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";

import { draftjsToMd } from "@components/rich-editor/draftjs/draftjsToMd";
import { mdToDraftjs, REGEXPS } from "@components/rich-editor/draftjs/mdToDraftjs";

export const containUnsupportedStyles = (attr: Record<string, string> = {}) => {
  return !!REGEXPS.map((r) => r.regexp).find(
    (regexp) => !!Object.keys(attr).find((key) => regexp.test(attr[key])),
  );
};
export const htmlToRawText = (html: string) => {
  const el = document.createElement("div");
  el.innerHTML = html || "";
  return el.textContent;
};

export const htmlLength = (html: string) => htmlToRawText(html)!.trim().length;
export const htmlIsEmpty = (html: string) => !(htmlLength(html) > 0);

/**
 * We cannot handle the markup exactly in ths same that it is in the remote
 * repository. So we format it the `ui` way and then we only operate on this
 * representation.
 */
export const rmesHtmlToRawHtml = (html: string) => cleanHtml(stateToHTML(stateFromHTML(html)));

/**
 * We need to transform Draft Html to Xhtml
 */
export const draftHtmlToXhtml = (html: string) =>
  html
    .replace(/&nbsp;/g, " ")
    .replace(/<br>/g, "<br/>")
    .replace(/<p><\/p>/g, "<br/>");

/**
 * We need to transform back the html to comply with the repository rules
 */
export const rawHtmlToRmesHtml = (html: string) =>
  `<div xmlns="http://www.w3.org/1999/xhtml">${draftHtmlToXhtml(html)}</div>`;

const rNewLine = /\n/g;
const rUselessSpace = /(>)\s*(<)/g;
export const cleanHtml = (html: string) => {
  const rawText = htmlToRawText(html);
  if (rawText === "") return "";
  return html.replace(rNewLine, "").replace(rUselessSpace, "$1$2");
};

export const delPTags = (s: string) => s && s.replace(/<p>/g, "").replace(/<\/p>/g, "");

//HACK avoid new lines and unecesseray whitespaces in the html. Not safe: some
//of these whitespaces might impact the rendered html. But for notes edited with
//the html editor, it should be ok.
export function htmlFromEditorState(editorState: typeof EditorState) {
  function setStyle(property: string, color: string) {
    return {
      element: "span",
      style: {
        [property]: color,
      },
    };
  }
  const options = {
    inlineStyleFn: (styles: string[]) => {
      let key = "color-";
      let color = styles.find((value: string) => value.startsWith(key));
      if (color) {
        return setStyle("color", color.replace(key, ""));
      }

      key = "bgcolor-";
      color = styles.find((value: string) => value.startsWith(key));
      if (color) {
        return setStyle("backgroundColor", color.replace(key, ""));
      }
    },
  };

  const html = stateToHTML(editorState.getCurrentContent(), options as Options);
  return cleanHtml(html);
}

export function editorStateFromHtml(html: string) {
  return EditorState.createWithContent(stateFromHTML(html));
}

export function mdFromEditorState(editorState: typeof EditorState) {
  /*
   * Sometimes the React editor  include space when formatting text (bold or italic).
   * With the following code, we remove this issue.
   * https://trello.com/c/t6jFYvMR/633-sims-rich-text
   */
  const content = convertToRaw(editorState.getCurrentContent());

  for (const block of content.blocks) {
    const text = block.text;
    const inlineStyleRanges = block.inlineStyleRanges;
    for (
      let inlineStyleIndex = 0;
      inlineStyleIndex < inlineStyleRanges.length;
      inlineStyleIndex++
    ) {
      const currentInlineStyle = inlineStyleRanges[inlineStyleIndex];
      const withSameOffset = inlineStyleRanges.filter((_: unknown, index: number) => {
        return (
          index !== inlineStyleIndex &&
          inlineStyleRanges[index].offset === currentInlineStyle.offset
        );
      });
      let minLength = Math.min(
        currentInlineStyle.length,
        ...withSameOffset.map((style: any) => style.length),
      );
      if (text[currentInlineStyle.offset + minLength - 1] === " ") {
        minLength -= 1;
      }
      currentInlineStyle.length = minLength;
      withSameOffset.forEach((style: any) => {
        style.lengh = minLength;
      });
    }
  }
  return draftjsToMd(content);
}

export function editorStateFromMd(md = "") {
  const mdToDraftJs = mdToDraftjs(md);
  const convertedFromRaw = convertFromRaw(mdToDraftJs);
  return EditorState.createWithContent(convertedFromRaw);
}

export function markdownToHtml(markdown: string) {
  return htmlFromEditorState(editorStateFromMd(markdown));
}

export function renderMarkdownElement(value: string) {
  if (value === null) {
    return "";
  }
  return <div dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }} />;
}
