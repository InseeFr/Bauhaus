import React from 'react';

import { Note } from '@inseefr/wilco';
import { D1, D2 } from 'js/i18n';
import { getSeeAlsoByType } from 'js/applications/operations/shared/links/utils';
import DisplayLinks from 'js/applications/operations/shared/links/';
import SeeAlso from 'js/applications/operations/shared/seeAlso';
import { HTMLUtils } from 'bauhaus-utilities';
import { PublicationMale } from 'js/applications/operations/shared/status';

function DisplayMultiLangNote({
	value1,
	value2,
	title,
	langs: { lg1, lg2 },
	secondLang,
	md = false,
}) {
	const body1 = md ? HTMLUtils.renderMarkdownElement(value1) : value1;

	const body2 = md ? HTMLUtils.renderMarkdownElement(value2) : value2;

	return (
		<div className="row">
			<Note
				text={body1}
				title={D1[title]}
				lang={lg1}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note
					text={body2}
					title={D2[title]}
					lang={lg2}
					alone={false}
					allowEmpty={true}
				/>
			)}
		</div>
	);
}

function formatPrimitiveToArray(object = []) {
	return Array.isArray(object) ? object : [object];
}

function OperationsIndicatorVisualization(props) {
	const { attr, langs, secondLang, frequency = {}, organisations = [] } = props;
	const seeAlso = getSeeAlsoByType(attr.seeAlso);

	const creators = formatPrimitiveToArray(attr.creators).map(
		(d) => organisations.find((orga) => orga.id === d) || {}
	);

	const contributors = (attr.contributors || []).map(
		(d) => organisations.find((orga) => orga.id === d.id) || {}
	);

	return (
		<React.Fragment>
			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D1.indicatorStatus} : <PublicationMale object={attr} />
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</div>
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
					text={
						<ul>
							{attr.publishers?.map((g) => (
								<li>{g}</li>
							))}
						</ul>
					}
					title={D1.organisation}
					lang={langs.lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row" data-cy="proprietaires">
				<Note
					text={
						<ul>
							{creators.map(({ label }, index) => (
								<li key={index}>{label}</li>
							))}
						</ul>
					}
					title={D1.creatorTitle}
					lang={langs.lg1}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<DisplayLinks
				links={contributors}
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
