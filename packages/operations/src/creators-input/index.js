import React from 'react';
import { useSelector } from 'react-redux';
import SelectRmes from 'js/applications/shared/select-rmes';
import * as select from 'js/reducers';

import { D1 } from '../i18n/build-dictionary';

const CreatorsInput = ({ value, onChange }) => {
	const stamps = useSelector((state) => select.getStampList(state) || []);
	const stampsOptions = stamps.map((stamp) => ({
		value: stamp,
		label: stamp,
	}));
	const creatorsArray = Array.isArray(value) ? value : [value];

	return (
		<label htmlFor="contributor" className="w-100">
			{D1.creatorTitle}
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
