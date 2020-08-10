import React, { useState, useMemo } from 'react';
import { Select } from '@inseefr/wilco';
import D from 'js/i18n';

const geographies = [
	{ labelLg1: 'Somme', labelLg2: 'Somme', value: '3' },
	{ labelLg1: 'Aisne', labelLg2: 'Aisne', value: '5' },
	{ labelLg1: 'Haut de France', labelLg2: 'Haut de France', value: '6' },
	{ labelLg1: 'Paris', labelLg2: 'Paris', value: '7' },
	{ labelLg1: 'Bourgogne', labelLg2: 'Bourgogne', value: '8' },
];

const SimsGeographyLabel = ({ geography }) => (
	<>
		{geography.labelLg1} <i>({geography.labelLg2})</i>
	</>
);
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
			label: <SimsGeographyLabel geography={geography} />,
		}));
	}, []);

	const excludedItems = excludes.map(geography => (
		<li className="list-group-item" key={geography.value}>
			<>
				<SimsGeographyLabel geography={geography} />
				<button
					type="button"
					className="documentsbloc__delete documentsbloc__btn"
					aria-label={D.btnDelete}
					onClick={console.log}
				>
					<span className="glyphicon glyphicon-trash" aria-hidden="true" />
				</button>
			</>
		</li>
	));
	const includedItems = includes.map(geography => (
		<li className="list-group-item" key={geography.value}>
			<>
				<SimsGeographyLabel geography={geography} />
				<button
					type="button"
					className="documentsbloc__delete documentsbloc__btn"
					aria-label={D.btnDelete}
					onClick={console.log}
				>
					<span className="glyphicon glyphicon-trash" aria-hidden="true" />
				</button>
			</>
		</li>
	));

	return (
		<>
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

			<div className="row">
				<div className="col-md-6">
					<h4>Zones géographiques inclues</h4>
					{includedItems}
				</div>
				<div className="col-md-6">
					<h4>Zones géographiques exclues</h4>
					{excludedItems}
				</div>
			</div>
		</>
	);
};

export default SimsGeographyField;
