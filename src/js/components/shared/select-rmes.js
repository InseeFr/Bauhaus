import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { dictionary } from 'js/utils/dictionary';
import 'react-select/dist/react-select.css';
import './select-rmes.css';

function SelectRmes({
	value,
	placeholder,
	options,
	onChange,
	unclearable,
	searchable,
	multi,
}) {
	const isClearable = unclearable ? false : true;
	return (
		<Select
			value={value}
			placeholder={placeholder}
			options={options}
			onChange={e => onChange(e ? e.value : '')}
			clearable={isClearable}
			searchable={searchable}
			noResultsText={dictionary.noResult}
		/>
	);
}

SelectRmes.defaultProps = {
	multi: false,
	clearable: false,
	searchable: true,
};

SelectRmes.propTypes = {
	value: PropTypes.string.isRequired,
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
};

export default SelectRmes;
