import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { CodeListDataTable, CodeTableRow } from "./CodeListDataTable";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Vraie DataTable PrimeReact (pas de mock) : c'est son rendu effectif qui est vérifié.

const codesOf = (count: number): CodeTableRow[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `code-${index}`,
    value: String(index),
    label: `Modalité ${index}`,
    categoryId: `category-${index}`,
  }));

const renderTable = (codes: CodeTableRow[], readOnly = true) =>
  render(
    <CodeListDataTable
      codeListLabel="Liste"
      codes={codes}
      onCodeListLabelChange={vi.fn()}
      onCellEdit={vi.fn()}
      onDeleteCode={vi.fn()}
      onAddCode={vi.fn()}
      readOnly={readOnly}
    />,
  );

const bodyRows = () => {
  const table = screen.getByRole("table");
  const [, ...rows] = within(table).getAllByRole("row");
  return rows;
};

describe("CodeListDataTable — volumétrie", () => {
  it("does not render every row of a very large code list", async () => {
    // happy-dom ne calcule aucune mise en page : on donne au viewport la taille d'un écran pour que
    // le virtual scroller sache combien de lignes afficher.
    using _height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(600);
    using _width = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800);
    using _rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue(DOMRect.fromRect({ width: 800, height: 600 }));
    // Le scroller retranche paddings et bordures lus via getComputedStyle : sans feuille de style,
    // happy-dom les rend vides (NaN une fois parsés) et aucune ligne n'est calculée.
    const style = document.createElement("style");
    style.textContent = "* { padding: 0px; border-width: 0px; }";
    document.head.appendChild(style);
    using _style = { [Symbol.dispose]: () => style.remove() };

    renderTable(codesOf(5_000));

    expect(await screen.findByDisplayValue("Modalité 0")).toBeInTheDocument();
    expect(bodyRows().length).toBeLessThan(5_000);
  });

  it("renders every row of a small code list", () => {
    renderTable(codesOf(5), false);

    expect(bodyRows()).toHaveLength(5);
  });
});
