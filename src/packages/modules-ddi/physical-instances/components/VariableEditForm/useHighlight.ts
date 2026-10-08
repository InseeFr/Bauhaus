import { useEffect, useState } from "react";

export type HighlightLanguage = "xml" | "json";

type Highlighter = (code: string) => string;

const languageImports: Record<HighlightLanguage, () => Promise<{ default: any }>> = {
  xml: () => import("highlight.js/lib/languages/xml"),
  json: () => import("highlight.js/lib/languages/json"),
};

const loadHighlighter = async (language: HighlightLanguage): Promise<Highlighter> => {
  const [hljsModule, langModule] = await Promise.all([
    import("highlight.js/lib/core"),
    languageImports[language](),
    import("highlight.js/styles/github.css"),
  ]);
  const hljs = hljsModule.default;
  if (!hljs.getLanguage(language)) {
    hljs.registerLanguage(language, langModule.default);
  }
  return (code) => hljs.highlight(code, { language }).value;
};

// Le chunk de highlight.js peut ne pas se charger (ré-optimisation des dépendances par Vite en
// dev, réseau coupé). L'aperçu doit alors retomber sur le code brut plutôt que de laisser filer
// une promesse rejetée non gérée.
const warnUnavailable = (error: unknown) => {
  console.warn("Coloration syntaxique indisponible :", error);
};

/**
 * Au-delà, la coloration (synchrone, sur le thread principal) et le DOM qu'elle produit — un
 * `<span>` par jeton — gèlent l'onglet : le DDI 3 d'une variable portant une liste mutualisée de
 * 45 000 codes pèse 55 Mo et bloquait l'interface près d'une minute. Le code est alors affiché brut.
 */
export const MAX_HIGHLIGHTED_LENGTH = 200_000;

export const useHighlight = (code: string, language: HighlightLanguage): string | null => {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    if (code.length > MAX_HIGHLIGHTED_LENGTH) {
      setHighlightedHtml(null);
      return;
    }

    let cancelled = false;

    loadHighlighter(language)
      .then((highlight) => {
        if (!cancelled) {
          setHighlightedHtml(highlight(code));
        }
      })
      .catch((error: unknown) => {
        warnUnavailable(error);
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

/**
 * Fonction de coloration d'un fragment, pour qui ne colore que ce qu'il affiche (les lignes
 * visibles d'un aperçu virtualisé). `null` tant que highlight.js n'est pas chargé, ou s'il n'a pas pu l'être.
 */
export const useHighlighter = (language: HighlightLanguage): Highlighter | null => {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadHighlighter(language)
      .then((highlight) => {
        if (!cancelled) {
          setHighlighter(() => highlight);
        }
      })
      .catch((error: unknown) => {
        warnUnavailable(error);
        if (!cancelled) {
          setHighlighter(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  return highlighter;
};
