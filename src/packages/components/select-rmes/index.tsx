import OriginalSelect from 'react-select';
import 'react-select/dist/react-select.css';

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
