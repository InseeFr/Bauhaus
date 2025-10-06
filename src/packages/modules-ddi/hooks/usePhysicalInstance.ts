import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type {
	PhysicalInstanceResponse,
	VariableTableData,
	Variable,
} from '../physical-instances/types/api';

import { DDIApi } from '../../sdk';

function formatDate(dateString: string, locale: string): string {
	if (!dateString) return '';

	try {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat(locale, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).format(date);
	} catch {
		return dateString;
	}
}

function transformVariablesToTableData(
	data: PhysicalInstanceResponse,
	locale: string,
): VariableTableData[] {
	if (!data.Variable) {
		return [];
	}

	return data.Variable.map((variable: Variable) => ({
		id: variable.ID,
		name: variable.VariableName?.String?.['#text'] || '',
		label: variable.Label?.Content?.['#text'] || '',
		type: getVariableType(variable),
		lastModified: formatDate(variable['@versionDate'] || '', locale),
	}));
}

function getVariableType(variable: Variable): string {
	if (variable.VariableRepresentation?.CodeRepresentation) {
		return 'Code';
	}
	if (variable.VariableRepresentation?.NumericRepresentation) {
		return 'Numeric';
	}
	return 'Unknown';
}

export function usePhysicalInstancesData(id: string) {
	const { i18n } = useTranslation();
	const query = useQuery({
		queryKey: ['physicalInstanceById', id],
		queryFn: () => DDIApi.getPhysicalInstance(id),
	});

	const variables: VariableTableData[] = query.data
		? transformVariablesToTableData(query.data, i18n.language)
		: [];

	const title =
		query.data?.PhysicalInstance?.[0]?.Citation?.Title?.String?.['#text'] || '';
	const dataRelationshipName =
		query.data?.DataRelationship?.[0]?.DataRelationshipName?.String?.[
			'#text'
		] || '';

	return {
		...query,
		variables,
		title,
		dataRelationshipName,
	};
}
