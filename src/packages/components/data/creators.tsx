import { Organization as OrganizationType } from '../../model/organization';

interface OrganizationsTypes {
	creators: string[];
	organizations: OrganizationType[];
}
export const Organizations = ({
	creators,
	organizations,
}: Readonly<OrganizationsTypes>) => {
	return (
		<ul>
			{creators?.map((creator) => {
				return (
					<li key={creator}>
						<Organization creator={creator} organizations={organizations} />
					</li>
				);
			})}
		</ul>
	);
};

interface OrganizationTypes {
	creator: string;
	organizations: OrganizationType[];
}

export const Organization = ({
	creator,
	organizations,
}: Readonly<OrganizationTypes>) => {
	if (!organizations) {
		return <></>;
	}
	const organization = organizations.find((o) => o.iri === creator);
	return <>{organization?.label}</>;
};
