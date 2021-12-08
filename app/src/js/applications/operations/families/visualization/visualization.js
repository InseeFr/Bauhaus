import React from 'react';

import { Note } from '@inseefr/wilco';
import { D1, D2 } from 'js/i18n';
import RelationsView from 'js/applications/operations/shared/relations';
import { DateUtils, HTMLUtils, PublicationFemale, withTitle } from 'bauhaus-utilities';
import D from '../../../../i18n/build-dictionary';

function OperationsFamilyVisualization({
	attr,
	langs: { lg1, lg2 },
	secondLang,
}) {
	return (
		<>
			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D1.createdDateTitle} : {DateUtils.stringToDate(attr.created)}
							</li>
							<li>
								{D1.modifiedDateTitle} : {DateUtils.stringToDate(attr.modified)}
							</li>
							<li>
								{D1.familyStatus} : <PublicationFemale object={attr} />
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</div>
			<div className="row">
				<Note
					text={attr.themeLg1}
					title={D1.theme}
					alone={!secondLang}
					allowEmpty={true}
				/>

				{secondLang && (
					<Note
						text={attr.themeLg2}
						title={D2.theme}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>

			<div className="row">
				<Note
					text={HTMLUtils.renderMarkdownElement(attr.abstractLg1)}
					title={D1.summary}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={HTMLUtils.renderMarkdownElement(attr.abstractLg2)}
						title={D2.summary}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
			<RelationsView
				children={attr.series}
				childrenTitle={'childrenSeries'}
				childrenPath="series"
				title={'linksTitle'}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
			/>
		</>
	);
}

export default withTitle(OperationsFamilyVisualization, D.operationsTitle, props => {
	return props.attr?.prefLabelLg1;
});
