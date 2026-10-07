import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { CodeListDataTable, CodeTableRow } from "./CodeListDataTable";
import { withScreenLayout } from "./virtualScrollerLayout.testing";

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
    using _layout = withScreenLayout();

    renderTable(codesOf(5_000));

    expect(await screen.findByDisplayValue("Modalité 0")).toBeInTheDocument();
    expect(bodyRows().length).toBeLessThan(5_000);
  });

  it("virtualizes an editable code list of any size", async () => {
    using _layout = withScreenLayout();

    renderTable(codesOf(150), false);

    expect(await screen.findByDisplayValue("Modalité 0")).toBeInTheDocument();
    expect(bodyRows().length).toBeLessThan(150);
  });

  it("focuses a code added at the end of a list longer than the screen", async () => {
    using _layout = withScreenLayout();
    const Harness = () => {
      const [codes, setCodes] = useState(codesOf(150));
      return (
        <CodeListDataTable
          codeListLabel="Liste"
          codes={codes}
          onCodeListLabelChange={vi.fn()}
          onCellEdit={vi.fn()}
          onDeleteCode={vi.fn()}
          onAddCode={() =>
            setCodes((current) => [
              ...current,
              { id: "new-code", value: "", label: "", categoryId: "new-category", isNew: true },
            ])
          }
        />
      );
    };
    const { container } = render(<Harness />);
    await screen.findByDisplayValue("Modalité 0");

    fireEvent.click(screen.getByRole("button", { name: "physicalInstance.view.code.addCode" }));
    // happy-dom applique le défilement demandé sans émettre l'événement `scroll` du navigateur,
    // celui sur lequel le virtual scroller recalcule les lignes à rendre.
    fireEvent.scroll(container.querySelector(".p-virtualscroller")!);

    await waitFor(() =>
      expect(document.activeElement).toHaveAttribute(
        "placeholder",
        "physicalInstance.view.code.value",
      ),
    );
    expect(screen.queryByDisplayValue("Modalité 0")).not.toBeInTheDocument();
  });
});
