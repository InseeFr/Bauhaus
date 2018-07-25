import React from 'react';

import { Note } from 'js/components/shared/note';
import D from 'js/i18n';

function SerieInformation(props) {
	const {
		attr,
		langs: { lg1, lg2 },
		secondLang,
		frequency = {},
		category = {},
	} = props;

	return (
		<div>
			<div className="row">
				<Note
					text={attr.altLabelLg1}
					title={D.altLabel}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={attr.altLabelLg2}
						title={D.altLabel}
						lang={lg2}
						alone={false}
						allowEmpty={true}
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
				/>
				{secondLang && (
					<Note
						text={attr.abstractLg2}
						title={D.summary}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>

			<div className="row">
				<Note
					text={attr.historyNoteLg1}
					title={D.history}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={attr.historyNoteLg2}
						title={D.history}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>

			<div className="row">
				<Note
					text={category.labelLg1}
					title={D.operationType}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={category.labelLg2}
						title={D.operationType}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>

			<div className="row">
				<Note
					text={frequency.labelLg1}
					title={D.dataCollectFrequency}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={frequency.labelLg2}
						title={D.dataCollectFrequency}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
			<div className="row">
				<Note
					text={attr.creator}
					title={D.organisation}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note
					text={attr.contributor}
					title={D.stackeholders}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>

			<div className="row">
				<Note
					text={attr.serviceCollector}
					title={D.dataCollector}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note
					text={attr.replaces}
					title={D.replaces}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note
					text={attr.replacedBy}
					title={D.replacedBy}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note
					text={attr.indicators}
					title={D.indicators}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note
					text={attr.seeAlso}
					title={D.seeAlso}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
		</div>
	);
}

export default SerieInformation;
