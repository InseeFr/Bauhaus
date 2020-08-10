import React, { useState, useMemo } from 'react';
import { Select } from '@inseefr/wilco';
import D from 'js/i18n';
import InputRmes from 'js/applications/shared/input-rmes';
import {
	SimsGeographyI18NLabel,
	SimsGeographySelector,
} from 'bauhaus-operations';

const geographies = [
	{ labelLg1: 'Somme', labelLg2: 'Somme', value: '3' },
	{ labelLg1: 'Aisne', labelLg2: 'Aisne', value: '5' },
	{ labelLg1: 'Haut de France', labelLg2: 'Haut de France', value: '6' },
	{ labelLg1: 'Paris', labelLg2: 'Paris', value: '7' },
	{ labelLg1: 'Bourgogne', labelLg2: 'Bourgogne', value: '8' },
];

const SimsGeographyField = props => {
	const [value, setValue] = useState(null);
	const [excludes] = useState([
		{ labelLg1: 'Nord', labelLg2: 'Nord', value: '1' },
		{ labelLg1: 'Pas de Calais', labelLg2: 'Pas de Calais', value: '2' },
	]);
	const [includes] = useState([
		{ labelLg1: 'Ecosse', labelLg2: 'Scotland', value: '9' },
	]);

	const options = useMemo(() => {
		return geographies.map(geography => ({
			value: geography.value,
			label: <SimsGeographyI18NLabel geography={geography} />,
		}));
	}, []);

	return (
		<>
			<div className="row">
				<InputRmes
					label={D.simsGeographyZoneName}
					value={''}
					handleChange={console.log}
					className="w-100"
				/>
			</div>
			<div className="bauhaus-sims-geography-field">
				<Select
					placeholder=""
					value={options.find(option => option.value === value)}
					options={options}
					onChange={value => setValue(value)}
				/>
				<div className="btn-group" role="group">
					<button
						type="button"
						className="btn btn-default"
						disabled={value === null}
					>
						Inclure
					</button>
					<button
						type="button"
						className="btn btn-default"
						disabled={value === null}
					>
						Exclure
					</button>
				</div>
			</div>

			<SimsGeographySelector includes={includes} excludes={excludes} />
		</>
	);
};

export default SimsGeographyField;
