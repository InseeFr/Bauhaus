import { Organization as OrganizationType } from '../../../model/organization';

interface OrganisationsTypes {
	creators: string[];
	organizations: OrganizationType[];
}
export const Organisations = ({
	creators,
	organizations,
}: Readonly<OrganisationsTypes>) => {
	return (
		<ul>
			{creators?.map((creator) => {
				return (
					<li key={creator}>
						<Organisation creator={creator} organizations={organizations} />
					</li>
				);
			})}
		</ul>
	);
};

interface OrganisationTypes {
	creator: string;
	organizations: OrganizationType[];
}

export const Organisation = ({
	creator,
	organizations,
}: Readonly<OrganisationTypes>) => {
	if (!organizations) {
		return <></>;
	}
	const organization = organizations.find((o) => o.iri === creator);
	return <>{organization?.label}</>;
};
