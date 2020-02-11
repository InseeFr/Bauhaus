import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '@inseefr/ui';
import { D1, D2 } from 'js/i18n';

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
		levelsLg2 = levels.map((m, i) =>
			m.labelLg2 ? (
				<li key={i}>
					<Link
						to={`/classifications/classification/${classificationId}/level/${m.id}`}
					>
						{m.labelLg2}
					</Link>
				</li>
			) : null
		);
	const isMembersLg2 = levelsLg2.filter(m => m !== null).length !== 0;
	return (
		<div className="row">
			<Note
				alone={!(secondLang && isMembersLg2)}
				title={D1.classificationLevelsTitle}
				text={levelsLg1}
			></Note>
			{secondLang && isMembersLg2 && (
				<Note
					alone={false}
					title={D2.classificationLevelsTitle}
					text={levelsLg2}
				></Note>
			)}
		</div>
	);
};
