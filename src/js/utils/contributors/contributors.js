import D from 'js/i18n';
import { convertToArrayIfDefined } from '../array-utils';
import { D1 } from '../../applications/structures/i18n/build-dictionary';
import { SelectRmes } from '../index';
import { LabelRequired } from '@inseefr/wilco';

export const ContributorsVisualisation = ({ contributors }) => {
	return (
		<>
			{D.contributorTitle} :
			<ul>
				{convertToArrayIfDefined(contributors)?.map((c) => (
					<li key={c}>{c}</li>
				))}
			</ul>
		</>
	);
};

export const ContributorsInput = ({
	value,
	handleChange,
	stampListOptions,
}) => {
	return (
		<>
			<LabelRequired>{D.contributorTitle}</LabelRequired>
			<SelectRmes
				placeholder={D1.stampsPlaceholder}
				value={stampListOptions?.filter((c) =>
					convertToArrayIfDefined(value)?.some((a) => a.includes(c.value))
				)}
				options={stampListOptions}
				onChange={(values) => handleChange(values.map(({ value }) => value))}
				searchable
				multi
			/>
		</>
	);
};
