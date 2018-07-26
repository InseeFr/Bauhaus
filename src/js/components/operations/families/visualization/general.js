import React from 'react';

import { Note } from 'js/components/shared/note';
import D from 'js/i18n';
function FamilyInformation(props) {
	const { attr, langs: { lg1, lg2 }, secondLang } = props;

	return (
		<div>
			<div className="row">
				<Note
					text={attr.themeLg1}
					title={D.theme}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={attr.themeLg2}
						title={D.theme}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>

			<div className="row">
				<Note
					text={attr.abstractLg1}
					title={D.descriptionTitle}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					md
				/>
				{secondLang && (
					<Note
						text={attr.abstractLg2}
						title={D.descriptionTitle}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						md
					/>
				)}
			</div>
		</div>
	);
}

export default FamilyInformation;
