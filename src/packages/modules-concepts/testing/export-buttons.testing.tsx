import { useCallback } from "react";

/**
 * Remplaçant de `components/ExportButtons` exposant un bouton par type d'export :
 * `vi.mock(".../components/ExportButtons", () => import(".../testing/export-buttons.testing"))`.
 */
export const ExportButtons = ({
  disabled,
  exportHandler,
}: {
  disabled?: boolean;
  exportHandler: (type: string, withConcepts: boolean, lang?: string) => void;
}) => {
  const exportOds = useCallback(() => exportHandler("ods", false), [exportHandler]);
  const exportOdt = useCallback(() => exportHandler("odt", false), [exportHandler]);
  const exportOdtLg2 = useCallback(() => exportHandler("odt", false, "lg2"), [exportHandler]);
  const exportWithConcepts = useCallback(() => exportHandler("odt", true), [exportHandler]);

  return (
    <div data-testid="export-buttons">
      <span data-testid="disabled-state">{String(!!disabled)}</span>
      <button data-testid="export-ods" onClick={exportOds}>
        Export ODS
      </button>
      <button data-testid="export-odt" onClick={exportOdt}>
        Export ODT
      </button>
      <button data-testid="export-odt-lg2" onClick={exportOdtLg2}>
        Export ODT LG2
      </button>
      <button data-testid="export-with-concepts" onClick={exportWithConcepts}>
        Export with concepts
      </button>
    </div>
  );
};
