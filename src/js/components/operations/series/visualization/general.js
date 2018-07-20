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
			{attr.altLabelLg1 && (
				<div className="row">
					<Note
						text={attr.altLabelLg1}
						title={D.altLabelTitle}
						lang={lg1}
						alone={!secondLang || !attr.altLabelLg2}
					/>
					{secondLang && (
						<Note
							text={attr.altLabelLg2}
							title={D.altLabelTitle}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.abstractLg1 && (
				<div className="row">
					<Note
						text={attr.abstractLg1}
						title={D.summary}
						lang={lg1}
						alone={!secondLang || !attr.abstractLg2}
					/>
					{secondLang && (
						<Note
							text={attr.abstractLg2}
							title={D.summary}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}

			{attr.historyNoteLg1 && (
				<div className="row">
					<Note
						text={attr.historyNoteLg1}
						title={D.history}
						lang={lg1}
						alone={!secondLang || !attr.historyNoteLg2}
					/>
					{secondLang && (
						<Note
							text={attr.historyNoteLg2}
							title={D.history}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}

			{attr.typeList && (
				<div className="row">
					<Note
						text={category.labelLg1}
						title={D.operationType}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={category.labelLg2}
							title={D.operationType}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}

			{attr.accrualPeriodicityList && (
				<div className="row">
					<Note
						text={frequency.labelLg1}
						title={D.dataCollectFrequency}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={frequency.labelLg2}
							title={D.dataCollectFrequency}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.creator && (
				<div className="row">
					<Note
						text={attr.creator}
						title={D.organisation}
						lang={lg1}
						alone={true}
					/>
				</div>
			)}
			{attr.contributor && (
				<div className="row">
					<Note
						text={attr.contributor}
						title={D.stackeholders}
						lang={lg1}
						alone={true}
					/>
				</div>
			)}

			{attr.serviceCollector && (
				<div className="row">
					<Note
						text={attr.serviceCollector}
						title={D.dataCollector}
						lang={lg1}
						alone={true}
					/>
				</div>
			)}
			{attr.replaces && (
				<div className="row">
					<Note
						text={attr.replaces}
						title={D.replaces}
						lang={lg1}
						alone={true}
					/>
				</div>
			)}
			{attr.replacedBy && (
				<div className="row">
					<Note
						text={attr.replacedBy}
						title={D.replacedBy}
						lang={lg1}
						alone={true}
					/>
				</div>
			)}
			{attr.indicators && (
				<div className="row">
					<Note
						text={attr.indicators}
						title={D.indicators}
						lang={lg1}
						alone={true}
					/>
				</div>
			)}
			{attr.seeAlso && (
				<div className="row">
					<Note text={attr.seeAlso} title={D.seeAlso} lang={lg1} alone={true} />
				</div>
			)}
		</div>
	);
}

export default SerieInformation;
