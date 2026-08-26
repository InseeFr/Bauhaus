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
    ])
      .then(([hljsModule, langModule]) => {
        if (cancelled) return;
        const hljs = hljsModule.default;
        if (!hljs.getLanguage(language)) {
          hljs.registerLanguage(language, langModule.default);
        }
        const result = hljs.highlight(code, { language });
        setHighlightedHtml(result.value);
      })
      .catch((error: unknown) => {
        // Le chunk de highlight.js peut ne pas se charger (ré-optimisation des dépendances par
        // Vite en dev, réseau coupé). L'aperçu doit alors retomber sur le code brut plutôt que
        // de laisser filer une promesse rejetée non gérée.
        console.warn("Coloration syntaxique indisponible :", error);
        if (!cancelled) {
          setHighlightedHtml(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return highlightedHtml;
};
