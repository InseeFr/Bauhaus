import React from 'react';

import { Note } from 'js/components/shared/note';
import D from 'js/i18n';

function SerieInformation(props) {
	const {
		attr,
		langs: { lg1, lg2 },
		secondLang,
	} = props;

	return (
		<div>
			{attr.intitule1 && (
				<div className="row">
					<Note
						text={attr.intitule1}
						title={D.title}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.intitule2}
							title={D.title}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.altLabel1 && (
				<div className="row">
					<Note
						text={attr.altLabel1}
						title={D.altLabelTitle}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.altLabel2}
							title={D.altLabelTitle}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.summary1 && (
				<div className="row">
					<Note
						text={attr.summary1}
						title={D.summary}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.summary2}
							title={D.summary}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.history1 && (
				<div className="row">
					<Note
						text={attr.history1}
						title={D.history}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.history2}
							title={D.history}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default SerieInformation;
