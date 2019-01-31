import React from 'react';
import PropTypes from 'prop-types';
import flag from 'js/components/shared/flag';

function InputRmes({
	colMd,
	value,
	label,
	lang,
	star,
	hiddenStar,
	disabled,
	password,
	handleChange,
	arias,
}) {
	return (
		<div className={`form-group col-md-${colMd || 12}`}>
			<label className="form-label">
				{label} {flag(lang) ? '( ' : null} {flag(lang)}{' '}
				{flag(lang) ? ' )' : null}
				{star && <span className="boldRed">*</span>}
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
