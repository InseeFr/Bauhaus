import React from 'react';
import { SelectRmes, StampsApi } from 'bauhaus-utilities';
import { D1 } from '../i18n/build-dictionary';
import { useQuery } from '@tanstack/react-query';

const CreatorsInput = ({ value, onChange }) => {
	const { data: stampsOptions } = useQuery(['stamps'], () => {
		return StampsApi.getStamps().then(stamps => stamps.map(stamp => ({
			value: stamp,
			label: stamp
		})))
	})

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
