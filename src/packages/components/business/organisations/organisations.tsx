import { ComponentType } from "react";
import { Organization as OrganizationType } from "../../../model/organization";
import { useOrganizations } from "../../../utils/hooks/organizations";

interface BaseOrganizationProps {
  organizations: OrganizationType[];
}

interface OrganisationsTypes extends BaseOrganizationProps {
  creators: string[];
}

interface OrganisationTypes extends BaseOrganizationProps {
  creator: string;
}

export const Organisations = ({ creators, organizations }: Readonly<OrganisationsTypes>) => {
  if (!creators || creators.length === 0) {
    return null;
  }

  return (
    <ul>
      {creators.map((creator) => (
        <li key={creator}>
          <Organisation creator={creator} organizations={organizations} />
        </li>
      ))}
    </ul>
  );
};

export const Organisation = ({ creator, organizations }: Readonly<OrganisationTypes>) => {
  if (!creator || !organizations || organizations.length === 0) {
    return null;
  }

  const organization = organizations.find((o) => o.iri === creator);

  if (!organization) {
    return null;
  }

  return <>{organization.label}</>;
};

export const withInseeOrganisations = <P extends { organizations?: OrganizationType[] }>(
  Component: ComponentType<P>,
) => {
  const WrappedComponent = (props: Omit<P, "organizations">) => {
    const { data: organizations = [] } = useOrganizations();

    return <Component {...(props as P)} organizations={organizations} />;
  };

  WrappedComponent.displayName = `withInseeOrganisations(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
};

export const InseeOrganisations = withInseeOrganisations(Organisations);
export const InseeOrganisation = withInseeOrganisations(Organisation);
