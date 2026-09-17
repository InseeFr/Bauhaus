/**
 * Doublure de `@components/searchable-list` :
 * `vi.mock("@components/searchable-list", () => import("…/searchable-list.testing"))`.
 * La liste porte le `childPath` reçu en `data-path`.
 */
export const SearchableList = ({
  items,
  childPath,
}: {
  items: { id: string; label: string }[];
  childPath: string;
}) => (
  <ul data-testid="searchable-list" data-path={childPath}>
    {items.map((item) => (
      <li key={item.id}>{item.label}</li>
    ))}
  </ul>
);
