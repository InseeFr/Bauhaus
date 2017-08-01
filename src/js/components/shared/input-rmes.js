import React from 'react';
import PropTypes from 'prop-types';

function InputRmes({
  colMd,
  value,
  label,
  flag,
  star,
  hiddenStar,
  handleChange,
}) {
  return (
    <div className={`form-group col-md-${colMd}`}>
      <label>
        {label} ( {flag} )
        {/* TODO handle visibility */}
        {star && <span className="boldRed">*</span>}
        {hiddenStar && <span className="boldWhite">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        className="form-control"
        onChange={e => handleChange(e.target.value)}
      />
    </div>
  );
}

InputRmes.propTypes = {
  colMd: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  flag: PropTypes.element,
  star: PropTypes.bool,
  value: PropTypes.string, //might be undefined
  handleChange: PropTypes.func.isRequired,
};

export default InputRmes;
