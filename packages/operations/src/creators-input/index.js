import React from 'react';
import { useSelector } from 'react-redux';
import { Stores, SelectRmes } from 'bauhaus-utilities';
import { D1 } from '../i18n/build-dictionary';

const CreatorsInput = ({ value, onChange }) => {
	const stamps = useSelector(
		(state) => Stores.Stamps.getStampList(state) || []
	);
	const stampsOptions = stamps.map((stamp) => ({
		value: stamp,
		label: stamp,
	}));
	const creatorsArray = Array.isArray(value) ? value : [value];

	return (
		<label htmlFor="contributor" className="w-100 wilco-label-required">
			{D1.creatorTitle}
			<span className="asterisk">*</span>
			<SelectRmes
				placeholder=""
				unclearable
				multi
				value={creatorsArray}
				options={stampsOptions}
				onChange={(value) => onChange(value.map((v) => v.value))}
			/>
		</label>
	);
};

export default CreatorsInput;
