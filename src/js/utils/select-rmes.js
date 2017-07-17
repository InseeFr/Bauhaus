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
  field,
  handleChange,
  clearable,
  searchable,
  multi,
}) {
  const opts = options.map(opt => {
    if (field) return { value: opt[field], label: opt[field] };
    else return { value: opt, label: opt };
  });

  return (
    <Select
      value={value}
      placeholder={placeholder}
      options={opts}
      onChange={e => handleChange(e.value)}
      clearable={true}
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
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string).isRequired,
    PropTypes.arrayOf(PropTypes.object).isRequired,
  ]).isRequired,
  handleChange: PropTypes.func.isRequired,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  creatable: PropTypes.bool,
};

export default SelectRmes;
