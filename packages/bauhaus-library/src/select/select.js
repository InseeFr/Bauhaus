import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import './select.scss';

function mySelect({
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
}) {
  const isClearable = unclearable ? false : true;
  return (
    <FormGroup controlId={id}>
      {label && <ControlLabel>{label}</ControlLabel>}{' '}
      <Select
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        clearable={isClearable}
        searchable={searchable}
        multi={multi}
      />
      {helpMsg && <HelpBlock style={{ color: 'red' }}>{helpMsg}</HelpBlock>}
    </FormGroup>
  );
}

mySelect.defaultProps = {
  multi: false,
  clearable: false,
  searchable: true,
};

mySelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  creatable: PropTypes.bool,
};

export default mySelect;
