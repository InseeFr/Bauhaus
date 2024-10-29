import SimsGeographyI18NLabel from './sims-geography-i18n-label';
import D from '../../i18n/build-dictionary';
import { Row } from '../../../components';

export type Geography = {
	value: string;
	label: string;
	labelLg2: string;
	typeTerritory: string;
};
type SimsGeographySelectorTypes = {
	excludes: Geography[];
	includes: Geography[];
	onRemoveExclude: (value: Geography) => void;
	onRemoveInclude: (value: Geography) => void;
};
const SimsGeographySelector = ({
	includes,
	excludes,
	onRemoveExclude,
	onRemoveInclude,
}: Readonly<SimsGeographySelectorTypes>) => {
	const excludedItems = excludes.map((geography) => (
		<li className="list-group-item" key={geography.value}>
			<SimsGeographyI18NLabel geography={geography} />

			<button
				type="button"
				className="documentsbloc__delete documentsbloc__btn"
				aria-label={D.btnDelete}
				onClick={() => onRemoveExclude(geography)}
			>
				<span className="glyphicon glyphicon-trash" aria-hidden="true" />
			</button>
		</li>
	));

	const includedItems = includes.map((geography) => (
		<li className="list-group-item" key={geography.value}>
			<SimsGeographyI18NLabel geography={geography} />

			<button
				type="button"
				className="documentsbloc__delete documentsbloc__btn"
				aria-label={D.btnDelete}
				onClick={() => onRemoveInclude(geography)}
			>
				<span className="glyphicon glyphicon-trash" aria-hidden="true" />
			</button>
		</li>
	));
	return (
		<Row>
			<div className="col-md-6">
				<h4>{D.includedZone}</h4>
				{includedItems}
			</div>
			<div className="col-md-6">
				<h4>{D.excludedZone}</h4>
				{excludedItems}
			</div>
		</Row>
	);
};

export default SimsGeographySelector;
