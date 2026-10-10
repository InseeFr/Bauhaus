import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useCallback, useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { CodeListDataTable, type CodeTableRow } from "./CodeListDataTable";
import { withScreenLayout } from "./virtualScrollerLayout.testing";

/**
 * Ce fichier est le seul à monter le tableau avec les VRAIS composants PrimeReact : les cellules
 * de `DataTable` sont mémoïsées sur la seule ligne de données (`cellMemo`), si bien qu'un état du
 * tableau — le gel de la saisie pendant la garde — n'atteint pas les champs tant que la ligne ne
 * change pas. Les autres specs mockent `DataTable` et ne peuvent donc rien en dire.
 */
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        "physicalInstance.view.code.codeListLabel": "Libellé de la liste de codes",
        "physicalInstance.view.code.value": "Valeur",
        "physicalInstance.view.code.label": "Libellé",
        "physicalInstance.view.code.addCode": "Ajouter un code",
      })[key] ?? key,
  }),
}));

const initialCodes: CodeTableRow[] = [
  { id: "code-1", value: "1", label: "Oui", categoryId: "category-1" },
];

const Harness = ({ onCellCommit }: { onCellCommit: () => Promise<boolean> }) => {
  const [codes, setCodes] = useState(initialCodes);
  const onCellEdit = useCallback(
    (rowData: CodeTableRow, field: "value" | "label", newValue: string) =>
      setCodes((rows) =>
        rows.map((row) => (row.id === rowData.id ? { ...row, [field]: newValue } : row)),
      ),
    [],
  );
  return (
    <CodeListDataTable
      codeListLabel="Liste de codes test"
      codes={codes}
      onCodeListLabelChange={vi.fn()}
      onCellEdit={onCellEdit}
      onCellCommit={onCellCommit}
      onDeleteCode={vi.fn()}
      onAddCode={vi.fn()}
    />
  );
};

describe("CodeListDataTable rendered with the real DataTable", () => {
  /** Garde pilotée à la main, pour observer le champ pendant puis après la décision. */
  const renderWithPendingGuard = () => {
    let decide: (interrupted: boolean) => void = () => {};
    const onCellCommit = vi.fn(() => new Promise<boolean>((resolve) => (decide = resolve)));
    render(<Harness onCellCommit={onCellCommit} />);
    return { decide: (interrupted: boolean) => decide(interrupted) };
  };

  const labelInput = () => screen.getAllByPlaceholderText("Libellé")[0];

  it("unfreezes the edited cell once the guard has answered", async () => {
    using _layout = withScreenLayout();
    // Régression : après « Annuler » dans la popup de surcharge, le champ restait en lecture
    // seule et plus aucune frappe n'était possible — la ligne n'ayant pas changé, la cellule
    // mémoïsée gardait le rendu gelé.
    const { decide } = renderWithPendingGuard();

    fireEvent.change(labelInput(), { target: { value: "Europe" } });

    // Saisie gelée le temps de la décision.
    await waitFor(() => expect(labelInput()).toHaveAttribute("readonly"));

    decide(true);

    await waitFor(() => expect(labelInput()).not.toHaveAttribute("readonly"));

    // Et la frappe suivante est bien prise en compte.
    fireEvent.change(labelInput(), { target: { value: "Europe modifiée" } });
    expect(labelInput()).toHaveValue("Europe modifiée");
  });
});
