import { useOrganizations } from "@utils/hooks/organizations";

export const SimsBlockOrganization = ({ currentSection }) => {
  const { data: organizations = [] } = useOrganizations();

  const value = currentSection?.value;

  if (!value) return null;

  const organization = organizations.find((o) => o.iri === value || o.id === value);

  return <span>{organization?.label ?? ""}</span>;
};
