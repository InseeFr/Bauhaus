import { convertToArrayIfDefined } from '@utils/array-utils';
import { useStampsOptions } from '@utils/hooks/stamps';

import D, { D1 } from '../i18n';
import LabelRequired from '../label-required';
import { Select } from '../select-rmes';

export const ContributorsVisualisation = ({
	contributors,
}: Readonly<{
	contributors: string[] | string;
}>) => {
	return (
		<>
			{D.contributors.title} :
			<ul>
				{convertToArrayIfDefined(contributors)?.map((c: string) => (
					<li key={c}>{c}</li>
				))}
			</ul>
		</>
	);
};

interface ContributorsInputType {
	value: string[];
	handleChange: (values: string[]) => void;
	required: boolean;
}
export const ContributorsInput = ({
	value,
	handleChange,
	required = false,
}: Readonly<ContributorsInputType>) => {
	const stampListOptions = useStampsOptions();

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
