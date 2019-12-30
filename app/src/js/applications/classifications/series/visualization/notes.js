import React from 'react';
import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import { D1, D2 } from 'js/i18n';

export default ({
	notes: { scopeNoteLg1, scopeNoteLg2 },
	secondLang,
	langs: { lg1, lg2 },
}) => (
	<div>
		{scopeNoteLg1 && (
			<div className="row">
				<ExplanatoryNote
					text={scopeNoteLg1}
					title={D1.classificationsScopeNote}
					lang={lg1}
					alone={!secondLang}
				/>
				{secondLang && (
					<ExplanatoryNote
						text={scopeNoteLg2}
						title={D2.classificationsScopeNote}
						lang={lg2}
						alone={false}
					/>
				)}
			</div>
		)}
	</div>
);
