import { ComponentType } from "react";

import { Organization as OrganizationModel } from "@model/organization";

import { useOrganizations } from "@utils/hooks/organizations";

interface BaseOrganizationProps {
  organizations: OrganizationModel[];
}

interface OrganizationsTypes extends BaseOrganizationProps {
  creators: string[];
}

interface OrganizationTypes extends BaseOrganizationProps {
  creator: string | null;
}

export const Organizations = ({ creators, organizations }: Readonly<OrganizationsTypes>) => {
  if (!creators || creators.length === 0) {
    return null;
  }

  return (
    <ul>
      {creators.map((creator) => (
        <li key={creator}>
          <Organization creator={creator} organizations={organizations} />
        </li>
      ))}
    </ul>
  );
};

export const Organization = ({ creator, organizations }: Readonly<OrganizationTypes>) => {
  if (!creator || !organizations || organizations.length === 0) {
    return null;
  }

  const organization = organizations.find((o) => o.iri === creator);

  if (!organization) {
    return null;
  }

  return organization.label;
};

export const withInseeOrganizations = <P extends { organizations?: OrganizationModel[] }>(
  Component: ComponentType<P>,
) => {
  const WrappedComponent = (props: Omit<P, "organizations">) => {
    const { data: organizations = [] } = useOrganizations();

    return <Component {...(props as P)} organizations={organizations} />;
  };

  WrappedComponent.displayName = `withInseeOrganizations(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
};

export const InseeOrganizations = withInseeOrganizations(Organizations);
export const InseeOrganization = withInseeOrganizations(Organization);
