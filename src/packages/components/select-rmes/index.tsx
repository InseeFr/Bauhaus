import OriginalSelect from 'react-select';
import 'react-select/dist/react-select.css';
import './select-rmes.scss';
import { createAllDictionary } from '../../utils/dictionnary';

const { D } = createAllDictionary({
	fr: 'Aucun résultat',
	en: 'No results',
});

type SelectRmesTypes = {
	onChange: (value: any) => void;
	unclearable?: boolean;
	multi?: boolean;
	searchable?: boolean;
	disabled?: boolean;
	placeholder?: string;
	value?: any;
	options?: any;
} & {};

export const Select = ({
	onChange,
	unclearable = false,
	multi = false,
	searchable = true,
	disabled = false,
	...props
}: SelectRmesTypes) => {
	const onChangeSelect = multi
		? (e: any) => onChange(e)
		: (e: any) => onChange(e ? e.value : '');

	return (
		// @ts-ignore
		<OriginalSelect
			{...props}
			multi={multi}
			searchable={searchable}
			disabled={disabled}
			onChange={onChangeSelect}
			clearable={!unclearable}
			noResultsText={D.noResult}
		/>
	);
};
