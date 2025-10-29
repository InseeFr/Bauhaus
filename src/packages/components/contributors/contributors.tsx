import { convertToArrayIfDefined } from '@utils/array-utils';

import { Options } from '../../model/SelectOption';
import D, { D1 } from '../i18n';
import LabelRequired from '../label-required';
import { Select } from '../select-rmes';
import { List } from '../ui/list';

export const ContributorsVisualisation = ({
	contributors,
}: Readonly<{
	contributors: string[] | string;
}>) => {
	return (
		<>
			{D.contributors.title} :
			<List<string>
				items={convertToArrayIfDefined(contributors)}
				getContent={(item) => item}
				getKey={(item) => item}
			/>
		</>
	);
};

interface ContributorsInputType {
	value: string[];
	handleChange: (values: string[]) => void;
	stampListOptions: Options;
	required: boolean;
}
export const ContributorsInput = ({
	value,
	handleChange,
	stampListOptions,
	required = false,
}: Readonly<ContributorsInputType>) => {
	return (
		<>
			{required ? (
				<LabelRequired>{D.contributors.title}</LabelRequired>
			) : (
				<label>{D.contributors.title}</label>
			)}
			<Select
				placeholder={D1.contributors.stampsPlaceholder}
				value={stampListOptions?.filter((c) =>
					convertToArrayIfDefined(value)?.some((a: string) =>
						a.includes(c.value),
					),
				)}
				options={stampListOptions}
				onChange={(values: { value: string }[]) =>
					handleChange(values.map(({ value }) => value))
				}
				searchable
				multi
			/>
		</>
	);
};
