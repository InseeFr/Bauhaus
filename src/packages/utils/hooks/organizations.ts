import { useQuery } from '@tanstack/react-query';
import { OrganisationsApi } from '../../sdk';
import { Organization } from '../../model/organization';
import { Options } from '../../model/SelectOption';
import { transformModelToSelectOptions } from '../transformer';

export const useOrganizations = () => {
	return useQuery({
		initialData: [],
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
