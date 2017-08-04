import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

export const htmlToRawText = html => {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  return el.textContent;
};

export const htmlLength = html => htmlToRawText(html).trim().length;
export const htmlIsEmpty = html => !(htmlLength(html) > 0);

/**
 * We cannot handle the markup exactly in ths same that it is in the remote
 * repository. So we format it the `ui` way and then we only operate on this
 * representation.
 */
export const rmesHtmlToRawHtml = html =>
  cleanHtml(stateToHTML(stateFromHTML(html)));

/**
 * We need to transform back the html to comply with the repository rules
 */
export const rawHtmlToRmesHtml = html =>
  `<div xmlns="http://www.w3.org/1999/xhtml">${html}</div>`;

const rNewLine = /\n/g;
const rUselessSpace = /(>)\s*(<)/g;
export const cleanHtml = html => {
  const rawText = htmlToRawText(html);
  if (rawText === '') return '';
  return html.replace(rNewLine, '').replace(rUselessSpace, '$1$2');
};

//HACK avoid new lines and unecesseray whitespaces in the html. Not safe: some
//of these whitespaces might impact the rendered html. But for notes edited with
//the html editor, it should be ok.
export function htmlFromEditorState(editorState) {
  const html = stateToHTML(editorState.getCurrentContent());
  return cleanHtml(html);
}

export function editorStateFromHtml(html) {
  return EditorState.createWithContent(stateFromHTML(html));
}
