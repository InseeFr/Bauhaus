import React from 'react';

import { Note } from 'js/components/shared/note';
import D from 'js/i18n';

function FamilyInformation(props) {
	const {
		attr,
		langs: { lg1, lg2 },
		secondLang,
	} = props;

	return (
		<div>
			{attr.prefLabelLg1 && (
				<div className="row">
					<Note
						text={attr.prefLabelLg1}
						title={D.title}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.prefLabelLg2}
							title={D.title}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.themeLg1 && (
				<div className="row">
					<Note
						text={attr.themeLg1}
						title={D.theme}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.themeLg2}
							title={D.theme}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.descriptionLg1 && (
				<div className="row">
					<Note
						text={attr.descriptionLg1}
						title={D.descriptionTitle}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.descriptionLg2}
							title={D.descriptionTitle}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default FamilyInformation;
