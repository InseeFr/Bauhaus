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
  clearable,
  searchable,
  multi,
}) {
  const opts = options.map(opt => ({ value: opt, label: opt }));

  return (
    <Select
      value={value}
      placeholder={placeholder}
      options={opts}
      onChange={e => onChange(e ? e.value : '')}
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
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  creatable: PropTypes.bool,
};

export default SelectRmes;
