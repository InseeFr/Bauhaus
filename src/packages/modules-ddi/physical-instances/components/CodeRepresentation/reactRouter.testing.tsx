/**
 * Remplacement de `react-router-dom` : la page courante est celle de la PhysicalInstance
 * `fr.insee/test-physical-instance-id`, et `Link` est rendu en simple ancre.
 *
 * Usage : `vi.mock("react-router-dom", () => import("./reactRouter.testing"));`
 */
export const useParams = () => ({
  id: "test-physical-instance-id",
  agencyId: "fr.insee",
});

type To = string | { pathname?: string; search?: string; hash?: string };

/** L'adresse d'un `to` de react-router, chaîne ou objet ; à défaut de chemin, la racine. */
const toHref = (to: To) =>
  typeof to === "string" ? to : `${to.pathname || "/"}${to.search ?? ""}${to.hash ?? ""}`;

export const Link = ({ to, children, ...props }: any) => (
  <a href={toHref(to)} {...props}>
    {children}
  </a>
);
