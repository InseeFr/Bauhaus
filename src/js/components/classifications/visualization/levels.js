import React from 'react';
import { Link } from 'react-router-dom';
import Panel from 'js/components/shared/panel';
import D from 'js/i18n';

export default ({ levels, classificationId, secondLang }) => {
	const levelsLg1 = levels.map((m, i) => (
		<li key={i}>
			<Link
				to={`/classifications/classification/${classificationId}/level/${m.id}`}
			>
				{m.labelLg1}
			</Link>
		</li>
	));
	let levelsLg2 = [];
	if (secondLang)
		levelsLg2 = levels.map(
			(m, i) =>
				m.labelLg2 ? (
					<li key={i}>
						<Link
							to={`/classifications/classification/${classificationId}/level/${
								m.id
							}`}
						>
							{m.labelLg2}
						</Link>
					</li>
				) : null
		);
	const isMembersLg2 = levelsLg2.filter(m => m !== null).length !== 0;
	return (
		<div className="row">
			<div className={`col-md-${secondLang ? 6 : 12}`}>
				<Panel title={D.classificationLevelsTitle} context="classifications">
					<ul>{levelsLg1}</ul>
				</Panel>
			</div>
			{secondLang &&
				isMembersLg2 && (
					<div className="col-md-6">
						<Panel
							title={D.classificationLevelsTitle}
							context="classifications"
						>
							<ul>{levelsLg2}</ul>
						</Panel>
					</div>
				)}
		</div>
	);
};
