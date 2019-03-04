import React from 'react';

import { Note } from 'js/components/shared/note/note';
import D from 'js/i18n';
import RelationsView from 'js/components/operations/shared/relations';
import DisplayLinks from 'js/components/operations/shared/links/';
import SeeAlso from 'js/components/operations/shared/seeAlso';
import { getSeeAlsoByType } from 'js/components/operations/shared/links/utils';

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
			<div className="row flex">
				<Note
					text={attr.altLabelLg1}
					title={D.altLabel}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
				/>
				{secondLang && (
					<Note
						text={attr.altLabelLg2}
						title={D.altLabel}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
					/>
				)}
			</div>
			<div className="row flex">
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

			<div className="row flex">
				<Note
					text={attr.historyNoteLg1}
					title={D.history}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
					md
				/>
				{secondLang && (
					<Note
						text={attr.historyNoteLg2}
						title={D.history}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
						md
					/>
				)}
			</div>

			<div className="row flex">
				<Note
					text={category.labelLg1}
					title={D.operationType}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
				/>
				{secondLang && (
					<Note
						text={category.labelLg2}
						title={D.operationType}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
					/>
				)}
			</div>

			<div className="row flex">
				<Note
					text={frequency.labelLg1}
					title={D.dataCollectFrequency}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
					context="operations"
				/>
				{secondLang && (
					<Note
						text={frequency.labelLg2}
						title={D.dataCollectFrequency}
						lang={lg2}
						alone={false}
						allowEmpty={true}
						context="operations"
					/>
				)}
			</div>

			<div className="row flex">
				<Note
					text={creator}
					title={D.organisation}
					lang={lg1}
					alone={true}
					allowEmpty={true}
					context="operations"
				/>
			</div>

			<DisplayLinks
				links={contributor}
				title={D.stakeholders}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
				context="operations"
			/>
			<DisplayLinks
				links={dataCollector}
				title={D.dataCollector}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
				context="operations"
			/>

			<div className="row flex" data-cy="gestionnaire">
				<Note
					text={gestionnaire}
					title={D.operationsContributorTitle}
					lang={lg1}
					alone={true}
					allowEmpty={true}
					context="operations"
				/>
			</div>
			<DisplayLinks
				links={attr.replaces}
				path={'/operations/series/'}
				title={D.replaces}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path={'/operations/series/'}
				title={D.replacedBy}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<DisplayLinks
				links={attr.generate}
				path={'/operations/indicator/'}
				title={D.indicators}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>

			<SeeAlso
				links={seeAlso}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>

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
				context="operations"
			/>
		</React.Fragment>
	);
}

export default OperationsSerieVisualization;
