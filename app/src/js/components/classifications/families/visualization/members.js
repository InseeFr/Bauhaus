import React from 'react';
import { Link } from 'react-router-dom';
import Panel from 'js/components/shared/panel';
import D, { D2 } from 'js/i18n';

export default ({ members, secondLang }) => {
	const membersLg1 = members.map((m, i) => (
		<li key={i}>
			<Link to={`/classifications/series/${m.id}`}>{m.labelLg1}</Link>
		</li>
	));
	let membersLg2 = [];
	if (secondLang)
		membersLg2 = members.map((m, i) =>
			m.labelLg2 ? (
				<li key={i}>
					<Link to={`/classifications/series/${m.id}`}>{m.labelLg2}</Link>
				</li>
			) : null
		);
	const isMembersLg2 = membersLg2.filter(m => m !== null).length !== 0;
	return (
		<div className="row">
			<div className={`col-md-${secondLang ? 6 : 12}`}>
				<Panel title={D.childrenSeries} context="classifications">
					<ul>{membersLg1}</ul>
				</Panel>
			</div>
			{secondLang && isMembersLg2 && (
				<div className="col-md-6">
					<Panel title={D2.childrenSeries} context="classifications">
						<ul>{membersLg2}</ul>
					</Panel>
				</div>
			)}
		</div>
	);
};
