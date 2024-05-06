import React from 'react';
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
	errorBlock = <></>,
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
					onChange={(e) => handleChange(e.target.value)}
					{...arias}
				/>
			</label>
			{errorBlock}
		</div>
	);
}

export default InputRmes;
