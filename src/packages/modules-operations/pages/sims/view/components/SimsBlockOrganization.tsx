import { useOrganizations } from "@utils/hooks/organizations";

import type { SimsBlockRubric } from "./SimsBlock";

interface SimsBlockOrganizationTypes {
  currentSection: SimsBlockRubric;
}

export const SimsBlockOrganization = ({ currentSection }: Readonly<SimsBlockOrganizationTypes>) => {
  const { data: organizations = [] } = useOrganizations();

  const value = currentSection?.value;

  if (!value) return null;

  const organization = organizations.find((o) => o.iri === value || o.id === value);

  return <span>{organization?.label ?? ""}</span>;
};
