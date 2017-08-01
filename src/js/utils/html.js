import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

export const htmlToRawText = html => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.innerText;
};

export const htmlLength = html => htmlToRawText(html).trim().length;
export const htmlIsEmpty = html => !(htmlLength(html) > 0);

/**
 * We cannot handle the markup exactly in ths same that it is in the remote
 * repository. So we format it the `ui` way and then we only operate on this
 * representation.
 */
export const rmesHtmlToRawHtml = html => stateToHTML(stateFromHTML(html));

/**
 * We need to transform back the html to comply with the repository rules
 */
export const rawHtmlToRmesHtml = html =>
  `<div xmlns="http://www.w3.org/1999/xhtml">${html}</div>`;
