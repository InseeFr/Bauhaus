import React from 'react';
import PropTypes from 'prop-types';

function InputRmes({
	colMd,
	value,
	label,
	flag,
	star,
	hiddenStar,
	disabled,
	password,
	handleChange,
}) {
	return (
		<div className={`form-group col-md-${colMd || 12}`}>
			<label>
				{label} {flag ? '( ' : null} {flag} {flag ? ' )' : null}
				{/* TODO handle visibility */}
				{star && <span className="boldRed">*</span>}
				{hiddenStar && <span className="boldWhite">*</span>}
			</label>
			<input
				type={password ? 'password' : 'text'}
				value={value || ''}
				className="form-control"
				disabled={disabled}
				onChange={e => handleChange(e.target.value)}
			/>
		</div>
	);
}

InputRmes.propTypes = {
	colMd: PropTypes.number,
	label: PropTypes.string,
	flag: PropTypes.element,
	star: PropTypes.bool,
	hiddenStar: PropTypes.bool,
	value: PropTypes.string, //might be undefined
	disabled: PropTypes.bool,
	password: PropTypes.bool,
	handleChange: PropTypes.func.isRequired,
};

export default InputRmes;
