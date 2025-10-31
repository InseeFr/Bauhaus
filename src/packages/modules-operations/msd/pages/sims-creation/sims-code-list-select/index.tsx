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

	if (!multi) {
		value = options.find(({ value }) => value === currentSection.value);
	} else {
		const currentSectionValue = Array.isArray(currentSection.value)
			? currentSection.value
			: [currentSection.value];

		value = options.filter(({ value }) => currentSectionValue.includes(value));
	}

	return (
		<Select
			{...rest}
			placeholder=""
			value={value}
			options={options}
			onChange={onChange}
			multi={multi}
		/>
	);
};
