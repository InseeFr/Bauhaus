import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AdvancedSearchLayout } from ".";

const renderLayout = (props: Partial<Parameters<typeof AdvancedSearchLayout>[0]> = {}) =>
  render(
    <MemoryRouter initialEntries={["/items/search"]}>
      <Routes>
        <Route
          path="/items/search"
          element={
            <AdvancedSearchLayout
              title="Recherche avancée de fichiers de données"
              backTo="/items"
              onReset={vi.fn()}
              criteria={<label>Libellé</label>}
              results={["a", "b"]}
              {...props}
            >
              <p>Tableau des résultats</p>
            </AdvancedSearchLayout>
          }
        />
        <Route path="/items" element={<p>Liste des éléments</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("AdvancedSearchLayout", () => {
  it("displays the title of the page as its main heading", () => {
    renderLayout();

    expect(
      screen.getByRole("heading", { level: 1, name: "Recherche avancée de fichiers de données" }),
    ).toBeVisible();
  });

  it("displays the criteria, the number of results and the results", () => {
    renderLayout();

    expect(screen.getByText("Libellé")).toBeVisible();
    expect(screen.getByText("2 results")).toBeVisible();
    expect(screen.getByText("Tableau des résultats")).toBeVisible();
  });

  it("goes back to the list when the back button is clicked", async () => {
    renderLayout({ backLabel: "Back to the list" });

    await userEvent.click(screen.getByRole("button", { name: "Back to the list" }));

    expect(screen.getByText("Liste des éléments")).toBeVisible();
  });

  it("labels the back button with a generic label by default", () => {
    renderLayout();

    expect(screen.getByRole("button", { name: "Back" })).toBeVisible();
  });

  it("displays the additional actions of the page", () => {
    renderLayout({ actions: <button type="button">Exporter</button> });

    expect(screen.getByRole("button", { name: "Exporter" })).toBeVisible();
  });

  it("resets the form when the reset button is clicked", async () => {
    const onReset = vi.fn();
    renderLayout({ onReset });

    await userEvent.click(screen.getByRole("button", { name: "Reinitialize" }));

    expect(onReset).toHaveBeenCalledOnce();
  });
});
