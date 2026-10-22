import rehypeParse from "rehype-parse";
import rehypeRemark, { type Options as RehypeRemarkOptions } from "rehype-remark";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

/**
 * Les notes de concepts sont stockées en HTML ; on les édite en markdown avec
 * `MDEditor`, comme le reste de l'application. Ces deux conversions font le pont.
 *
 * Seuls gras, italique, listes, liens et retours à la ligne sont gardés : ce que
 * l'ancien éditeur permettait. Le reste (souligné, couleurs…) ne garde que son texte.
 */

type Handle = NonNullable<NonNullable<RehypeRemarkOptions["handlers"]>[string]>;

// Par défaut, rehype-remark lit `<u>` comme de l'italique : on n'en garde que le texte.
const keepTextOnly: Handle = (state, node) => state.all(node);

const toMarkdown = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark, { handlers: { u: keepTextOnly, ins: keepTextOnly } })
  .use(remarkStringify, { emphasis: "*", strong: "*", bullet: "*" });

const toHtml = unified()
  .use(remarkParse)
  // Du HTML tapé dans l'éditeur reste du texte : jamais interprété, jamais perdu.
  // Seul sur sa ligne, c'est un bloc : il devient un paragraphe.
  .use(remarkRehype, {
    handlers: {
      html: (_state, node, parent) => {
        const text = { type: "text" as const, value: node.value };
        return parent?.type === "root"
          ? { type: "element", tagName: "p", properties: {}, children: [text] }
          : text;
      },
    },
  })
  .use(rehypeStringify, {
    closeSelfClosing: true,
    tightSelfClosing: true,
    // `&amp;`, `&lt;` comme dans les notes en base, plutôt que `&#x26;`.
    characterReferences: { useNamedReferences: true },
  });

const SAFE_URL = /^https?:\/\//i;

// Une ligne vide de l'ancien éditeur (`<p><br></p>`) n'a pas d'équivalent en markdown.
const EMPTY_LINE = /<p>\s*<br\s*\/?>\s*<\/p>/g;

export const noteHtmlToMarkdown = (html: string) =>
  String(toMarkdown.processSync(html.replaceAll(EMPTY_LINE, ""))).trim();

// Un lien javascript:, data:… enregistré tel quel serait une XSS à l'affichage :
// seul son texte est gardé.
const keepSafeLinks = (html: string) =>
  html.replaceAll(/<a href="([^"]*)">(.*?)<\/a>/gs, (link, url: string, text: string) =>
    SAFE_URL.test(url) ? link : text,
  );

// rehype-stringify n'échappe pas `>` dans le texte : les notes en base l'échappent.
const escapeGreaterThan = (html: string) =>
  html.replaceAll(/>([^<]*)/g, (_match, text: string) => `>${text.replaceAll(">", "&gt;")}`);

export const markdownToNoteHtml = (markdown: string) =>
  keepSafeLinks(escapeGreaterThan(String(toHtml.processSync(markdown)).replaceAll("\n", "")));
