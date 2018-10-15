import React from 'react';

import { Note } from 'js/components/shared/note';
import D from 'js/i18n';
import RelationsView from 'js/components/operations/shared/relations';

function FamilyInformation(props) {
	const {
		attr,
		langs: { lg1, lg2 },
		secondLang,
	} = props;

	return (
		<React.Fragment>
			<div className="row">
				<Note
					text={attr.themeLg1}
					title={D.theme}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
				/>

				{secondLang && (
					<Note
						text={attr.themeLg2}
						title={D.theme}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
					/>
				)}
			</div>

			<div className="row">
				<Note
					text={attr.abstractLg1}
					title={D.summary}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
					md
				/>
				{secondLang && (
					<Note
						text={attr.abstractLg2}
						title={D.summary}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
						md
					/>
				)}
			</div>
			<RelationsView
				children={attr.series}
				childrenTitle={D.childrenSeries}
				childrenPath="series"
				title={D.linksTitle}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
				context="operations"
			/>
		</React.Fragment>
	);
}

export default FamilyInformation;
