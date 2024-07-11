import Select from 'react-select';
import D from '../../i18n/build-dictionary';
import 'react-select/dist/react-select.css';
import './select-rmes.scss';

function SelectRmes({
	onChange,
	unclearable,
	multi = false,
	searchable = true,
	disabled = false,
	...props
}) {
	const onChangeSelect = multi
		? (e) => onChange(e)
		: (e) => onChange(e ? e.value : '');

	return (
		<Select
			{...props}
			multi={multi}
			searchable={searchable}
			disabled={disabled}
			onChange={onChangeSelect}
			clearable={!unclearable}
			noResultsText={D.noResult}
		/>
	);
}

export default SelectRmes;
