import { useEffect, useState } from "react";

type HighlightLanguage = "xml" | "json";

const languageImports: Record<HighlightLanguage, () => Promise<{ default: any }>> = {
  xml: () => import("highlight.js/lib/languages/xml"),
  json: () => import("highlight.js/lib/languages/json"),
};

export const useHighlight = (code: string, language: HighlightLanguage): string | null => {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      import("highlight.js/lib/core"),
      languageImports[language](),
      import("highlight.js/styles/github.css"),
    ]).then(([hljsModule, langModule]) => {
      if (cancelled) return;
      const hljs = hljsModule.default;
      if (!hljs.getLanguage(language)) {
        hljs.registerLanguage(language, langModule.default);
      }
      const result = hljs.highlight(code, { language });
      setHighlightedHtml(result.value);
    });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return highlightedHtml;
};
