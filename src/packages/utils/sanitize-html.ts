import DOMPurify from "dompurify";

/**
 * Cleans an HTML string before it goes through dangerouslySetInnerHTML:
 * keeps the formatting markup, drops scripts, event handlers and javascript: URLs.
 */
export const sanitizeHtml = (html: string): string => DOMPurify.sanitize(html);
