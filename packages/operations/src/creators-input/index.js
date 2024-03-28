import React from 'react';
import { SelectRmes, StampsApi } from 'bauhaus-utilities';
import { D1 } from '../i18n/build-dictionary';
import { useQuery } from '@tanstack/react-query';
import { LabelRequired } from '@inseefr/wilco';

const CreatorsInput = ({ value, onChange, multi }) => {
	const { data: stampsOptions = [] } = useQuery(['stamps'], () => {
		return StampsApi.getStamps().then(stamps => stamps.map(stamp => ({
			value: stamp,
			label: stamp
		})))
	})

	let creatorsArray = value;
	if(multi !== false && !Array.isArray(value)){
		creatorsArray = [value];
	}

	return (
		<div>
			<LabelRequired>{multi === false ? D1.creatorTitle : D1.creatorsTitle}</LabelRequired>
			<SelectRmes
				placeholder={D1.stampsPlaceholder}
				unclearable
				multi={multi ?? true}
				value={creatorsArray}
				options={stampsOptions}
				onChange={(value) => {
					if(multi === false){
						onChange(value)
					} else {
						onChange(value.map((v) => v.value))
					}
				}}
			/>
		</div>
	);
};

export default CreatorsInput;
