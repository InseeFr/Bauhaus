import React from 'react';

import { Note } from 'js/components/shared/note';
import D from 'js/i18n';
import { getSeeAlsoByType } from 'js/components/operations/shared/links/utils';
import DisplayLinks from 'js/components/operations/shared/links/';
import SeeAlso from 'js/components/operations/shared/seeAlso';

function DisplayMultiLangNote({
	value1,
	value2,
	title,
	langs: { lg1, lg2 },
	secondLang,
}) {
	return (
		<div className="row">
			<Note
				text={value1}
				title={title}
				lang={lg1}
				alone={!secondLang}
				allowEmpty={true}
				context="operations"
			/>
			{secondLang && (
				<Note
					text={value2}
					title={title}
					lang={lg2}
					alone={false}
					allowEmpty={true}
					context="operations"
				/>
			)}
		</div>
	);
}

function OperationsIndicatorVisualization(props) {
	const { attr, langs, secondLang, frequency = {}, organisations = [] } = props;
	const seeAlso = getSeeAlsoByType(attr.seeAlso);
	const creator = (organisations.find(orga => orga.id === attr.creator) || {})
		.label;
	const contributors = (attr.contributors || []).map(
		d => organisations.find(orga => orga.id === d.id) || {}
	);
	return (
		<React.Fragment>
			<DisplayMultiLangNote
				value1={attr.altLabelLg1}
				value2={attr.altLabelLg2}
				title={D.altLabel}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<DisplayMultiLangNote
				value1={attr.abstractLg1}
				value2={attr.abstractLg2}
				title={D.summary}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<DisplayMultiLangNote
				value1={attr.historyNoteLg1}
				value2={attr.historyNoteLg2}
				title={D.history}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<DisplayMultiLangNote
				value1={frequency.labelLg1}
				value2={frequency.labelLg2}
				title={D.indicatorDataCollectFrequency}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<div className="row">
				<Note
					text={creator}
					title={D.organisation}
					lang={langs.lg1}
					alone={true}
					allowEmpty={true}
					context="operations"
				/>
			</div>

			<DisplayLinks
				links={contributors}
				title={D.stakeholders}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
				context="operations"
			/>

			<DisplayLinks
				links={attr.replaces}
				path={'/operations/indicator/'}
				title={D.replaces}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path={'/operations/indicator/'}
				title={D.replacedBy}
				langs={langs}
				secondLang={secondLang}
				context="operations"
			/>
			<DisplayLinks
				links={attr.wasGeneratedBy}
				path={'/operations/series/'}
				title={D.generatedBy}
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
		</React.Fragment>
	);
}

export default OperationsIndicatorVisualization;
