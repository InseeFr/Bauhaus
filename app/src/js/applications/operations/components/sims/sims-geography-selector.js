import SimsGeographyI18NLabel from './sims-geography-i18n-label';
import D from '../../i18n/build-dictionary';

const SimsGeographySelector = ({
	includes,
	excludes,
	onRemoveExclude,
	onRemoveInclude,
}) => {
	const excludedItems = excludes.map((geography) => (
		<li className="list-group-item" key={geography.value}>
			<>
				<SimsGeographyI18NLabel geography={geography} />

				<button
					type="button"
					className="documentsbloc__delete documentsbloc__btn"
					aria-label={D.btnDelete}
					onClick={() => onRemoveExclude(geography)}
				>
					<span className="glyphicon glyphicon-trash" aria-hidden="true" />
				</button>
			</>
		</li>
	));

	const includedItems = includes.map((geography) => (
		<li className="list-group-item" key={geography.value}>
			<>
				<SimsGeographyI18NLabel geography={geography} />

				<button
					type="button"
					className="documentsbloc__delete documentsbloc__btn"
					aria-label={D.btnDelete}
					onClick={() => onRemoveInclude(geography)}
				>
					<span className="glyphicon glyphicon-trash" aria-hidden="true" />
				</button>
			</>
		</li>
	));
	return (
		<div className="row">
			<div className="col-md-6">
				<h4>{D.includedZone}</h4>
				{includedItems}
			</div>
			<div className="col-md-6">
				<h4>{D.excludedZone}</h4>
				{excludedItems}
			</div>
		</div>
	);
};

export default SimsGeographySelector;
