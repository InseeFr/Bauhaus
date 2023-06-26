import React from 'react';
import PropTypes from 'prop-types';
import { RequiredIcon } from 'bauhaus-utilities';

function InputRmes({
	colMd,
	value,
	label,
	star,
	hiddenStar,
	disabled,
	password,
	handleChange,
	arias,
	className = '',
	errorBlock = <></>
}) {
	return (
		<div className={`form-group col-md-${colMd || 12}`}>
			<label className={`form-label ${className}`}>
				{label}
				{star && <RequiredIcon />}
				{hiddenStar && <span className="boldWhite">*</span>}
				<input
					type={password ? 'password' : 'text'}
					value={value || ''}
					className="form-control"
					disabled={disabled}
					onChange={e => handleChange(e.target.value)}
					{...arias}
				/>
			</label>
			{errorBlock}
		</div>
	);
}

InputRmes.propTypes = {
	colMd: PropTypes.number,
	label: PropTypes.string,
	lang: PropTypes.string,
	star: PropTypes.bool,
	hiddenStar: PropTypes.bool,
	value: PropTypes.string, //might be undefined
	disabled: PropTypes.bool,
	password: PropTypes.bool,
	handleChange: PropTypes.func.isRequired,
};

export default InputRmes;
