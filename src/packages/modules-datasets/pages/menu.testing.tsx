import { render, screen } from "@testing-library/react";
import { ReactElement } from "react";

import { MODULE, PRIVILEGE, STRATEGY } from "@utils/hooks/rbac-constants";

import { mockReactQueryForRbac, WithRouter } from "../../tests/render";

export type PrivilegeGrant = [PRIVILEGE, STRATEGY];

export type MenuCase = {
  name: string;
  grants: PrivilegeGrant[];
  stamps?: { stamp: string }[];
  dataset: unknown;
  visible: string[];
  hidden: string[];
};

/** Cas de test d'un menu : par défaut aucun droit, un objet vide, seul « Back » visible. */
export const menuCase = (overrides: Partial<MenuCase> & Pick<MenuCase, "name">): MenuCase => ({
  grants: [],
  dataset: {},
  visible: ["Back"],
  hidden: [],
  ...overrides,
});

/**
 * Simule les droits RBAC de l'utilisateur, puis rend le menu produit par `loadMenu`.
 * Le menu doit être importé dans `loadMenu` : l'import dynamique n'a lieu qu'une fois
 * les droits simulés, ce qui est indispensable avec `vi.resetModules()`.
 */
export const renderMenuWithPrivileges = async (
  application: MODULE,
  grants: PrivilegeGrant[],
  loadMenu: () => Promise<ReactElement>,
  stamps?: { stamp: string }[],
) => {
  mockReactQueryForRbac(
    [
      {
        application,
        privileges: grants.map(([privilege, strategy]) => ({ privilege, strategy })),
      },
    ],
    stamps,
  );
  const menu = await loadMenu();
  return render(<WithRouter>{menu}</WithRouter>);
};

/**
 * Déclare un test par cas, nommé exactement d'après `name` (`it.each` avec `$name`
 * tronquerait les noms longs), qui rend le menu puis vérifie ses actions.
 */
export const itShowsMenuActions = (
  cases: MenuCase[],
  renderMenu: (menuCase: MenuCase) => Promise<unknown>,
) => {
  for (const current of cases) {
    it(current.name, async () => {
      await renderMenu(current);

      expectMenuActions(current);
    });
  }
};

export const expectMenuActions = ({ visible, hidden }: { visible: string[]; hidden: string[] }) => {
  for (const action of visible) {
    screen.getByText(action);
  }
  for (const action of hidden) {
    expect(screen.queryByText(action)).toBeNull();
  }
};
