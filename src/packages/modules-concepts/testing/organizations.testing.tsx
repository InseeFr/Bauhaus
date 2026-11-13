/**
 * Remplaçant de `@components/business/organizations/organizations` :
 * `vi.mock("@components/business/organizations/organizations", () => import(".../organizations.testing"))`.
 */
const labels: Record<string, string> = {
  "DG75-L201": "INSEE",
  "DG75-L202": "DARES",
};

export const InseeOrganization = ({ creator }: { creator: string }) => labels[creator] ?? creator;

export const InseeOrganizations = ({ creators }: { creators: string[] }) => (
  <ul>
    {creators.map((c) => (
      <li key={c}>{labels[c] ?? c}</li>
    ))}
  </ul>
);
