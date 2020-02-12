import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import ReactSelect from 'react-select';
import './select.scss';
import D from '../build-dictionary';

function Select({
	id,
	label,
	value,
	placeholder,
	options,
	onChange,
	unclearable,
	searchable,
	multi,
	helpMsg,
	disabled,
}) {
	const isClearable = unclearable ? false : true;
	const onChangeSelect = multi
		? e => onChange(e)
		: e => onChange(e ? e.value : '');

	return (
		<FormGroup controlId={id}>
			{label && <ControlLabel>{label}</ControlLabel>}{' '}
			<ReactSelect
				value={value}
				options={options}
				onChange={onChangeSelect}
				placeholder={placeholder}
				clearable={isClearable}
				searchable={searchable}
				noResultsText={D.noResult}
				multi={multi}
				disabled={disabled}
			/>
			{helpMsg && <HelpBlock style={{ color: 'red' }}>{helpMsg}</HelpBlock>}
		</FormGroup>
	);
}

Select.defaultProps = {
	multi: false,
	clearable: false,
	searchable: true,
	disabled: false,
	name: '',
};

Select.propTypes = {
	value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
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

export default Select;
