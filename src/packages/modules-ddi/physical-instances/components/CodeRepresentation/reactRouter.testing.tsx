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

export const Link = ({ to, children, ...props }: any) => (
  <a href={typeof to === "string" ? to : ""} {...props}>
    {children}
  </a>
);
