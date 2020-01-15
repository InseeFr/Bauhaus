import React from 'react';

import { Note } from 'bauhaus-library';
import { D1, D2 } from 'js/i18n';
import { getSeeAlsoByType } from 'js/applications/operations/shared/links/utils';
import DisplayLinks from 'js/applications/operations/shared/links/';
import SeeAlso from 'js/applications/operations/shared/seeAlso';

function DisplayMultiLangNote({
	value1,
	value2,
	title,
	langs: { lg1, lg2 },
	secondLang,
	md = false,
}) {
	return (
		<div className="row">
			<Note
				text={value1}
				title={D1[title]}
				lang={lg1}
				alone={!secondLang}
				allowEmpty={true}
				md={md}
			/>
			{secondLang && (
				<Note
					text={value2}
					title={D2[title]}
					lang={lg2}
					alone={false}
					allowEmpty={true}
					md={md}
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
	const contributor = (attr.contributor || []).map(
		d => organisations.find(orga => orga.id === d.id) || {}
	);

	return (
		<React.Fragment>
			<DisplayMultiLangNote
				value1={attr.altLabelLg1}
				value2={attr.altLabelLg2}
				title={'altLabel'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayMultiLangNote
				value1={attr.abstractLg1}
				value2={attr.abstractLg2}
				title={'summary'}
				langs={langs}
				secondLang={secondLang}
				md
			/>
			<DisplayMultiLangNote
				value1={attr.historyNoteLg1}
				value2={attr.historyNoteLg2}
				title={'history'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayMultiLangNote
				value1={frequency.labelLg1}
				value2={frequency.labelLg2}
				title={'indicatorDataCollectFrequency'}
				langs={langs}
				secondLang={secondLang}
			/>
			<div className="row">
				<Note
					text={creator}
					title={D1.organisation}
					lang={langs.lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row" data-cy="gestionnaire">
				<Note
					text={attr.gestionnaire}
					title={D1.operationsContributorTitle}
					lang={langs.lg1}
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
				links={attr.replaces}
				path={'/operations/indicator/'}
				title={'replaces'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path={'/operations/indicator/'}
				title={'replacedBy'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.wasGeneratedBy}
				path={'/operations/series/'}
				title={'generatedBy'}
				langs={langs}
				secondLang={secondLang}
			/>

			<SeeAlso links={seeAlso} langs={langs} secondLang={secondLang} />
		</React.Fragment>
	);
}

export default OperationsIndicatorVisualization;
