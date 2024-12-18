import { Select } from '@components/select-rmes';

import { Option } from '../../../../../model/SelectOption';

interface SimsCodeListSelectTypes {
	multi: boolean;
	currentSection: any;
	options: Option[];
	onChange: any;
}
export const SimsCodeListSelect = ({
	multi,
	currentSection,
	options,
	onChange,
	...rest
}: Readonly<SimsCodeListSelectTypes>) => {
	let value;
	let onChangeHandler;

	if (!multi) {
		value = options.find(({ value }) => value === currentSection.value);
		onChangeHandler = onChange;
	} else {
		const currentSectionValue = Array.isArray(currentSection.value)
			? currentSection.value
			: [currentSection.value];

		value = options.filter(({ value }) => currentSectionValue.includes(value));
		onChangeHandler = (values: Option[]) => {
			onChange((values || []).map(({ value }) => value));
		};
	}

	return (
		<Select
			{...rest}
			placeholder=""
			value={value}
			options={options}
			onChange={onChangeHandler}
			multi={multi}
		/>
	);
};
