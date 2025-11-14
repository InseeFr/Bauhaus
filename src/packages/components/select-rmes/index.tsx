import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

import { createAllDictionary } from '@utils/dictionnary';

import { Option } from '../../model/SelectOption';
import './select-rmes.scss';

const { D } = createAllDictionary({
	noResult: { fr: 'Aucun résultat', en: 'No results' },
});

type SelectRmesTypes = {
	onChange: (value: any) => void;
	unclearable?: boolean;
	multi?: boolean;
	searchable?: boolean;
	disabled?: boolean;
	placeholder?: string;
	value?: any;
	options?: Option[];
	itemTemplate?: MultiSelect['props']['itemTemplate'];
} & {};

export const Select = ({
	onChange,
	unclearable = false,
	multi = false,
	searchable = true,
	disabled = false,
	...props
}: SelectRmesTypes) => {
	if (multi) {
		return (
			<MultiSelect
				placeholder={props.placeholder}
				value={props.value}
				options={props.options}
				onChange={(e) => {
					onChange(e.value);
				}}
				display="chip"
				filter={searchable}
				className="w-full select-rmes-multi"
				disabled={disabled}
				showClear={!unclearable}
				emptyMessage={D.noResult}
				itemTemplate={props.itemTemplate}
			/>
		);
	}

	return (
		<Dropdown
			placeholder={props.placeholder}
			value={props.value}
			options={props.options}
			onChange={(e) => {
				onChange(e.value);
			}}
			filter={searchable}
			className="w-full select-rmes-single"
			disabled={disabled}
			showClear={!unclearable}
			emptyMessage={D.noResult}
			itemTemplate={props.itemTemplate}
		/>
	);
};
