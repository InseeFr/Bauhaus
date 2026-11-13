import Editor from "@uiw/react-md-editor/nohighlight";
import remarkBreaks from "remark-breaks";

/**
 * Cherche un style non supporté dans les valeurs de `attr`.
 *
 * Les appelants passent des objets métier entiers (`Family`, `Series`,
 * `Indicator`), dont toutes les valeurs ne sont pas des chaînes : d'où `object`
 * plutôt qu'un `Record<string, string>` qu'aucune interface ne satisfait, et la
 * conversion explicite que `RegExp.test` faisait déjà implicitement.
 */
export const containUnsupportedStyles = (attr: object = {}) =>
  Object.values(attr).some((value) => /(bg)?color-rgb\(\d*,\d*,\d*\)/.test(String(value)));

export const htmlToRawText = (html: string) => {
  const el = document.createElement("div");

  el.innerHTML = html || "";

  return el.textContent;
};

export const htmlLength = (html: string) => htmlToRawText(html)!.trim().length;

export const htmlIsEmpty = (html: string) => !(htmlLength(html) > 0);

const VOID_ELEMENTS = new Set(["area", "br", "col", "hr", "img", "input", "wbr"]);

const escapeXmlText = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// Sérialisation XML d'un nœud HTML : éléments vides en `<br/>`, sans attribut `xmlns`.
const toXhtml = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) return escapeXmlText(node.nodeValue ?? "");
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const element = node as Element;
  const tag = element.localName;
  const attributes = Array.from(element.attributes)
    .filter(({ name }) => name !== "xmlns")
    .map(({ name, value }) => ` ${name}="${escapeXmlText(value).replaceAll('"', "&quot;")}"`)
    .join("");
  if (VOID_ELEMENTS.has(tag)) return `<${tag}${attributes}/>`;
  const children = Array.from(element.childNodes).map(toXhtml).join("");
  return `<${tag}${attributes}>${children}</${tag}>`;
};

/**
 * Contenu d'une note telle que le back la stocke (XHTML entouré d'un
 * `<div xmlns="http://www.w3.org/1999/xhtml">`), sans cette enveloppe.
 *
 * Le contenu reste du XHTML : `rawHtmlToRmesHtml` le remet dans son enveloppe
 * tel quel, et une note non retouchée repart à l'identique. `DOMParser` ne
 * charge rien et n'exécute aucun gestionnaire.
 */
export const rmesHtmlToRawHtml = (html: string) => {
  const body = new DOMParser().parseFromString(html, "text/html").body;
  const wrapper = body.children.length === 1 ? body.firstElementChild : null;
  const root = wrapper?.localName === "div" ? wrapper : body;
  if (htmlIsEmpty(root.innerHTML)) return "";
  return Array.from(root.childNodes).map(toXhtml).join("");
};

/**
 * We need to transform Draft Html to Xhtml
 */
export const draftHtmlToXhtml = (html: string) =>
  html
    .replaceAll(/&nbsp;/g, " ")
    .replaceAll(/<br>/g, "<br/>")
    .replaceAll(/<p><\/p>/g, "<br/>");

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

  return html.replaceAll(rNewLine, "").replaceAll(rUselessSpace, "$1$2");
};

export const delPTags = (s: string) => s && s.replaceAll(/<p>/g, "").replaceAll(/<\/p>/g, "");

// L'ancien éditeur écrivait un paragraphe par ligne, séparées d'un seul `\n` :
// `remark-breaks` garde ces retours à la ligne, que le markdown standard fondrait.
const remarkPlugins = [remarkBreaks];

// `@uiw/react-markdown-preview` remplace le filtre d'URL de react-markdown par
// `url => url` : sans celui-ci, `[x](javascript:…)` donnerait un lien exécutable.
const keepHttpUrl = (url: string) => (/^https?:\/\//i.test(url) ? url : "");

/** Rendu en lecture d'un texte saisi avec `MDEditor`, par le même moteur que son aperçu. */
export function renderMarkdownElement(value: string) {
  if (value === null) {
    return "";
  }

  return (
    <Editor.Markdown source={value} remarkPlugins={remarkPlugins} urlTransform={keepHttpUrl} />
  );
}
