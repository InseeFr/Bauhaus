import D, { D1 } from '../i18n';
import { convertToArrayIfDefined } from '../../utils/array-utils';
import { SelectRmes } from '../../../utils/index';
import { LabelRequired } from '@inseefr/wilco';
import { Options } from '../../model/SelectOption';

export const ContributorsVisualisation = ({
	contributors,
}: {
	contributors: string[];
}) => {
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

type ContributorsInputType = {
	value: string[];
	handleChange: (values: string[]) => void;
	stampListOptions: Options;
	required: boolean;
};
export const ContributorsInput = ({
	value,
	handleChange,
	stampListOptions,
	required = false,
}: ContributorsInputType) => {
	return (
		<>
			{required ? (
				<LabelRequired>{D.contributors.title}</LabelRequired>
			) : (
				<label>{D.contributors.title}</label>
			)}
			<SelectRmes
				placeholder={D1.contributors.stampsPlaceholder}
				value={stampListOptions?.filter((c) =>
					convertToArrayIfDefined(value)?.some((a: string) =>
						a.includes(c.value)
					)
				)}
				options={stampListOptions}
				onChange={(values: { value: string }[]) =>
					handleChange(values.map(({ value }) => value))
				}
				searchable
				multi
				unclearable={false}
			/>
		</>
	);
};
