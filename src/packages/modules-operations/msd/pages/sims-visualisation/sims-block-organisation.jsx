import { useOrganizations } from "@utils/hooks/organizations";

const SimsBlockOrganisation = ({ currentSection }) => {
  const { data: organisations = [] } = useOrganizations();
  const value = currentSection?.value;
  if (!value) return null;

  const organisation = organisations.find((o) => o.iri === value || o.id === value);
  return <span>{organisation?.label ?? ""}</span>;
};

export default SimsBlockOrganisation;
