import React from 'react';

import { Note }  from 'bauhaus-library';
import D, { D2 } from 'js/i18n';
import RelationsView from 'js/applications/operations/shared/relations';
import DisplayLinks from 'js/applications/operations/shared/links/';
import SeeAlso from 'js/applications/operations/shared/seeAlso';
import { getSeeAlsoByType } from 'js/applications/operations/shared/links/utils';

function OperationsSerieVisualization({
	attr,
	langs: { lg1, lg2 },
	langs,
	secondLang,
	frequency = {},
	category = {},
	organisations = [],
}) {
	const seeAlso = getSeeAlsoByType(attr.seeAlso);

	const creator = (organisations.find(orga => orga.id === attr.creator) || {})
		.label;
	const gestionnaire = (
		organisations.find(orga => orga.id === attr.gestionnaire) || {}
	).label;
	const dataCollector = (attr.dataCollector || []).map(
		d => organisations.find(orga => orga.id === d.id) || {}
	);
	const contributor = (attr.contributor || []).map(
		d => organisations.find(orga => orga.id === d.id) || {}
	);
	return (
		<React.Fragment>
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
						title={D2.altLabel}
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
						title={D2.summary}
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
						title={D2.history}
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
						title={D2.operationType}
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
						title={D2.dataCollectFrequency}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>

			<div className="row">
				<Note
					text={creator}
					title={D.organisation}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>

			<DisplayLinks
				links={contributor}
				title={'stakeholders'}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>
			<DisplayLinks
				links={dataCollector}
				title={'dataCollector'}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>

			<div className="row" data-cy="gestionnaire">
				<Note
					text={gestionnaire}
					title={D.operationsContributorTitle}
					lang={lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<DisplayLinks
				links={attr.replaces}
				path={'/operations/series/'}
				title={'replaces'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path={'/operations/series/'}
				title={'replacedBy'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.generate}
				path={'/operations/indicator/'}
				title={'indicators'}
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
				title={'linksTitle'}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
			/>
		</React.Fragment>
	);
}

export default OperationsSerieVisualization;
