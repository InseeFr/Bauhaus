import { useQuery } from '@tanstack/react-query';

import { Select } from '@components/select-rmes';

import { ClassificationsApi } from '@sdk/classification';

import { D1 } from '../../deprecated-locales';
import { transformModelToSelectOptions } from '../../utils/transformer';

export const SeriesSelect = ({
	value,
	onChange,
}: Readonly<{ value: string; onChange: (value: string) => void }>) => {
	const { data: series } = useQuery({
		queryKey: ['classifications-series'],
		queryFn: () => {
			return ClassificationsApi.getSeriesList();
		},
	});
	const seriesOptions = transformModelToSelectOptions(series ?? []);

	return (
		<>
			<label>{D1.motherSeries}</label>
			<Select
				value={seriesOptions.find((option) => option.value === value)}
				options={seriesOptions}
				onChange={onChange}
			/>
		</>
	);
};
