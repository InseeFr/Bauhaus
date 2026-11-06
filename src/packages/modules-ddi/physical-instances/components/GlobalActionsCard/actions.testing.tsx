import { vi } from "vitest";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { ddiPrivileges } from "../../../privileges.testing";

/**
 * Bouton PrimeReact rendu en `<button>` natif (icône + libellé), partagé par les specs des
 * barres d'actions.
 *
 * Usage : `vi.mock("primereact/button", () => import("<chemin>/actions.testing"));`
 */
export const Button = ({ label, onClick, icon, ...props }: any) => (
  <button type="button" onClick={onClick} {...props}>
    {icon && <span className={icon} />}
    {label}
  </button>
);

/**
 * Accorde `privilege` avec `strategy` sur les PhysicalInstances et donne à l'utilisateur les
 * stamps `userStamps`. Suppose `@utils/hooks/users` mocké via `mockUsersHooks`.
 */
export const mockDdiAccess = (privilege: string, strategy: string, userStamps = ["STAMP1"]) => {
  vi.mocked(usePrivileges).mockReturnValue(ddiPrivileges(privilege, strategy) as any);
  vi.mocked(useUserStamps).mockReturnValue({
    data: userStamps.map((stamp) => ({ stamp })),
  } as any);
};
