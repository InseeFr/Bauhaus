import React from 'react';
import { Link } from 'react-router-dom';
import Panel from 'js/components/shared/panel';
import D from 'js/i18n';

export default ({ narrowers, classificationId, secondLang }) => {
	const narrowersLg1 = narrowers.map((n, i) => (
		<li key={i}>
			<Link
				to={`/classifications/classification/${classificationId}/item/${n.id}`}
			>
				{`${n.id} - ${n.labelLg1}`}
			</Link>
		</li>
	));
	let narrowersLg2 = [];
	if (secondLang)
		narrowersLg2 = narrowers.map(
			(n, i) =>
				n.labelLg2 ? (
					<li key={i}>
						<Link
							to={`/classifications/classification/${classificationId}/item/${
								n.id
							}`}
						>
							{`${n.id} - ${n.labelLg2}`}
						</Link>
					</li>
				) : null
		);
	const isMembersLg2 = narrowersLg2.filter(m => m !== null).length !== 0;
	return (
		<div className="row">
			<div className={`col-md-${secondLang ? 6 : 12}`}>
				<Panel title={D.classificationsNarrowerItems} context="classifications">
					<ul>{narrowersLg1}</ul>
				</Panel>
			</div>
			{secondLang &&
				isMembersLg2 && (
					<div className="col-md-6">
						<Panel
							title={D.classificationsNarrowerItems}
							context="classifications"
						>
							<ul>{narrowersLg2}</ul>
						</Panel>
					</div>
				)}
		</div>
	);
};
