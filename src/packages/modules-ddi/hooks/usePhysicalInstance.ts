import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type {
	PhysicalInstanceResponse,
	VariableTableData,
	Variable,
} from '../physical-instances/types/api';

const API_URL = 'https://poc-ddi-insee.netlify.app/.netlify/functions/api';

async function fetchPhysicalInstances(): Promise<PhysicalInstanceResponse> {
	const response = await fetch(API_URL);
	if (!response.ok) {
		throw new Error('Failed to fetch physical instances');
	}
	return response.json();
}

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

export function usePhysicalInstancesData() {
	const { i18n } = useTranslation();
	const query = useQuery({
		queryKey: ['physicalInstance'],
		queryFn: fetchPhysicalInstances,
	});

	const variables: VariableTableData[] = query.data
		? transformVariablesToTableData(query.data, i18n.language)
		: [];

	return {
		...query,
		variables,
	};
}
