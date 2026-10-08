import { VirtualScroller } from "primereact/virtualscroller";
import { useMemo } from "react";

import { useHighlight, useHighlighter, type HighlightLanguage } from "./useHighlight";

/**
 * Au-delà de ce nombre de lignes, l'aperçu est virtualisé : seules les lignes visibles sont dans
 * le DOM. En deçà, le code reste d'un seul bloc, que la recherche du navigateur (Ctrl+F) parcourt.
 */
export const VIRTUALIZATION_THRESHOLD = 1_000;

/** Hauteur fixe d'une ligne, requise par le virtual scroller ; reprise en CSS (`.ddi-preview-line`). */
const LINE_HEIGHT = 18;

interface CodeBlockProps {
  code: string;
  language: HighlightLanguage;
}

const WholeCode = ({ code, language }: Readonly<CodeBlockProps>) => {
  const highlightedHtml = useHighlight(code, language);

  return (
    <pre className="ddi-preview-code">
      {highlightedHtml === null ? (
        <code className={`hljs language-${language}`}>{code}</code>
      ) : (
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{
            __html: highlightedHtml,
          }}
        />
      )}
    </pre>
  );
};

/**
 * Chaque ligne est colorée seule, au rendu : le XML formaté porte une balise par ligne et le JSON
 * indenté aucune chaîne sur plusieurs lignes, la coloration ligne à ligne est donc fidèle.
 */
const VirtualizedCode = ({ lines, language }: { lines: string[]; language: HighlightLanguage }) => {
  const highlight = useHighlighter(language);

  return (
    <VirtualScroller
      items={lines}
      itemSize={LINE_HEIGHT}
      className={`ddi-preview-code ddi-preview-code--virtual hljs language-${language}`}
      itemTemplate={(line: string) =>
        highlight === null ? (
          <code className="ddi-preview-line">{line}</code>
        ) : (
          <code
            className="ddi-preview-line"
            dangerouslySetInnerHTML={{ __html: highlight(line) }}
          />
        )
      }
    />
  );
};

export const CodeBlock = ({ code, language }: Readonly<CodeBlockProps>) => {
  const lines = useMemo(() => code.split("\n"), [code]);

  if (lines.length > VIRTUALIZATION_THRESHOLD) {
    return <VirtualizedCode lines={lines} language={language} />;
  }
  return <WholeCode code={code} language={language} />;
};
