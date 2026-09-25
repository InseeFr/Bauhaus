import { fireEvent, screen, within } from "@testing-library/react";

/** Panneau de gauche (éléments disponibles) d'une PickList. */
export const sourceList = () => screen.getAllByRole("listbox")[0];

/** Panneau de droite (éléments retenus) d'une PickList. */
export const targetList = () => screen.getAllByRole("listbox")[1];

export const optionLabels = (list: HTMLElement) =>
  within(list)
    .queryAllByRole("option")
    .map((option) => option.textContent);

export const moveToTarget = (label: string) => {
  fireEvent.click(within(sourceList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Target" }));
};

export const moveToSource = (label: string) => {
  fireEvent.click(within(targetList()).getByRole("option", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: "Move to Source" }));
};

export const filterSource = (value: string) =>
  fireEvent.input(screen.getAllByPlaceholderText("Label...")[0], { target: { value } });

export const expectPanelTitles = (sourceTitle: string, targetTitle: string) => {
  expect(screen.getByText(sourceTitle)).toBeInTheDocument();
  expect(screen.getByText(targetTitle)).toBeInTheDocument();
};

/** Chaque panneau de la PickList a son propre filtre. */
export const expectFilterOnEachPanel = () =>
  expect(screen.getAllByPlaceholderText("Label...")).toHaveLength(2);

export const expectBackLinkTo = (href: string) => {
  // Use getByText since there are now multiple links (pagination adds links)
  const returnLink = screen.getByText("Back").closest("a");
  expect(returnLink).toHaveAttribute("href", href);
};
