import React from 'react';
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';
import D from 'js/i18n';

export default ({
	notes: {
		scopeNoteLg1,
		scopeNoteLg2,
		changeNoteLg1,
		changeNoteLg2,
		descriptionLg1,
		descriptionLg2,
	},
	secondLang,
	langs: { lg1, lg2 },
}) => (
	<div>
		<span>
			{descriptionLg1 && (
				<div className="row">
					<ExplanatoryNote
						text={descriptionLg1}
						title={D.classificationsDescription}
						lang={lg1}
						alone={!secondLang}
						context="classifications"
					/>
					{secondLang && (
						<ExplanatoryNote
							text={descriptionLg2}
							title={D.classificationsDescription}
							lang={lg2}
							alone={false}
							context="classifications"
						/>
					)}
				</div>
			)}
		</span>
		<span>
			{scopeNoteLg1 && (
				<div className="row">
					<ExplanatoryNote
						text={scopeNoteLg1}
						title={D.classificationsScopeNote}
						lang={lg1}
						alone={!secondLang}
						context="classifications"
					/>
					{secondLang && (
						<ExplanatoryNote
							text={scopeNoteLg2}
							title={D.classificationsScopeNote}
							lang={lg2}
							alone={false}
							context="classifications"
						/>
					)}
				</div>
			)}
		</span>
		<span>
			{changeNoteLg1 && (
				<div className="row">
					<ExplanatoryNote
						text={changeNoteLg1}
						title={D.classificationsChangeNote()}
						lang={lg1}
						alone={!secondLang}
						context="classifications"
					/>
					{secondLang && (
						<ExplanatoryNote
							text={changeNoteLg2}
							title={D.classificationsChangeNote()}
							lang={lg2}
							alone={false}
							context="classifications"
						/>
					)}
				</div>
			)}
		</span>
	</div>
);
