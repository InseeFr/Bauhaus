import React, { useState } from 'react';
import { SimsGeographySelector } from 'bauhaus-operations';

const SimsBlockGeography = ({ currentSection }) => {
	const [excludes] = useState([
		{ labelLg1: 'Nord', labelLg2: 'Nord', value: '1' },
		{ labelLg1: 'Pas de Calais', labelLg2: 'Pas de Calais', value: '2' },
	]);
	const [includes] = useState([
		{ labelLg1: 'Ecosse', labelLg2: 'Scotland', value: '9' },
	]);
	return (
		<>
			<>Zone name</>
			<SimsGeographySelector
				includes={includes}
				excludes={excludes}
				readOnly={true}
			/>
		</>
	);
};
export default SimsBlockGeography;
