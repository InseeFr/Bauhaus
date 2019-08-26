import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import D from 'js/i18n';
import 'react-select/dist/react-select.css';
import './select-rmes.scss';

function SelectRmes({
	value,
	placeholder,
	options,
	onChange,
	unclearable,
	searchable,
	multi,
	disabled,
}) {
	const isClearable = unclearable ? false : true;
	const onChangeSelect = multi
		? e => onChange(e)
		: e => onChange(e ? e.value : '');
	return (
		<Select
			name="hello"
			value={value}
			placeholder={placeholder}
			options={options}
			onChange={onChangeSelect}
			clearable={isClearable}
			searchable={searchable}
			noResultsText={D.noResult}
			multi={multi}
			disabled={disabled}
		/>
	);
}

SelectRmes.defaultProps = {
	multi: false,
	clearable: false,
	searchable: true,
	disabled: false,
	name: '',
};

SelectRmes.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
	placeholder: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	onChange: PropTypes.func.isRequired,
	clearable: PropTypes.bool,
	searchable: PropTypes.bool,
	creatable: PropTypes.bool,
	disabled: PropTypes.bool,
	name: PropTypes.string,
};

export default SelectRmes;
