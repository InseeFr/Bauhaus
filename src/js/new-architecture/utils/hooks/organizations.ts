import { useQuery } from '@tanstack/react-query';
import organisationApi from '../../../remote-api/organisations-api';
import { Organization } from '../../model/organization';
import { Options } from '../../model/SelectOption';
import { transformModelToSelectOptions } from '../transformer';

export const useOrganizations = () => {
	return useQuery({
		queryKey: ['organization'],
		queryFn: (): Promise<Organization[]> => {
			return organisationApi.getOrganisations() as Promise<Organization[]>;
		},
	});
};

export const useOrganizationsOptions = (): Options => {
	const { data = [] } = useOrganizations();
	return transformModelToSelectOptions(data);
};
