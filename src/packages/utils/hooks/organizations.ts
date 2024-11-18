import { useQuery } from '@tanstack/react-query';

import { Options } from '../../model/SelectOption';
import { Organization } from '../../model/organization';
import { OrganisationsApi } from '../../sdk';
import { transformModelToSelectOptions } from '../transformer';

export const useOrganizations = () => {
	return useQuery({
		placeholderData: [],
		queryKey: ['organization'],
		queryFn: (): Promise<Organization[]> => {
			return OrganisationsApi.getOrganisations() as Promise<Organization[]>;
		},
	});
};

export const useOrganizationsOptions = (): Options => {
	const { data = [] } = useOrganizations();
	return transformModelToSelectOptions(data);
};
