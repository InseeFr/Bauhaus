import React from 'react';

import { Note } from 'js/components/shared/note';
import D from 'js/i18n';
import RelationsView from 'js/components/operations/shared/relations';
import DisplayLinks from 'js/components/operations/shared/links/';
import SeeAlso from 'js/components/operations/shared/seeAlso';
import { getSeeAlsoByType } from 'js/components/operations/shared/links/utils';

function SerieInformation(props) {
	const {
		attr,
		langs: { lg1, lg2 },
		langs,
		secondLang,
		frequency = {},
		category = {},
	} = props;

	const seeAlso = getSeeAlsoByType(attr.seeAlso);
	const stakeHolder = attr.stakeHolder;
	const dataCollector = attr.dataCollector;
	const contributor = attr.contributor;
	const replaces = attr.replaces;
	const replacedBy = attr.isReplacedBy;
	const generate = attr.generate;

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
					md
				/>
				{secondLang && (
					<Note
						text={attr.abstractLg2}
						title={D.summary}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						md
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
					md
				/>
				{secondLang && (
					<Note
						text={attr.historyNoteLg2}
						title={D.history}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						md
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

			<DisplayLinks
				links={stakeHolder}
				title={D.stakeholders}
				langs={langs}
				secondLang={secondLang}
				displayLink={false}
			/>
			<DisplayLinks
				links={dataCollector}
				title={D.dataCollector}
				langs={langs}
				secondLang={secondLang}
				displayLink={false}
			/>
			<DisplayLinks
				links={contributor}
				title={D.contributorTitle}
				langs={langs}
				secondLang={secondLang}
				displayLink={false}
			/>
			<DisplayLinks
				links={replaces}
				path={'/operations/series/'}
				title={D.replaces}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={replacedBy}
				path={'/operations/series/'}
				title={D.replacedBy}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={generate}
				path={'/operations/indicator/'}
				title={D.indicators}
				langs={langs}
				secondLang={secondLang}
			/>

			<SeeAlso links={seeAlso} langs={langs} secondLang={secondLang} />

			<RelationsView
				children={attr.operations}
				childrenTitle={D.childrenOperations}
				childrenPath="operation"
				parent={attr.family}
				parentTitle={D.parentFamilly}
				parentPath="family"
				title={D.linksTitle}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
			/>
		</div>
	);
}

export default SerieInformation;
