/**
 * Remplaçant de `components/ExportButtons` exposant un bouton par type d'export :
 * `vi.mock(".../components/ExportButtons", () => import(".../testing/export-buttons.testing"))`.
 */
export const ExportButtons = ({
  disabled,
  exportHandler,
}: {
  disabled: boolean;
  exportHandler: (type: string, withConcepts: boolean, lang?: string) => void;
}) => (
  <div data-testid="export-buttons">
    <span data-testid="disabled-state">{disabled.toString()}</span>
    <button data-testid="export-ods" onClick={() => exportHandler("ods", false)}>
      Export ODS
    </button>
    <button data-testid="export-odt" onClick={() => exportHandler("odt", false)}>
      Export ODT
    </button>
    <button data-testid="export-odt-lg2" onClick={() => exportHandler("odt", false, "lg2")}>
      Export ODT LG2
    </button>
    <button data-testid="export-with-concepts" onClick={() => exportHandler("odt", true)}>
      Export with concepts
    </button>
  </div>
);
