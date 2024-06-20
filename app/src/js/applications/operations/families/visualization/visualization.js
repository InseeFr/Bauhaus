import { Note } from '@inseefr/wilco';
import { D1, D2 } from 'js/i18n';
import RelationsView from 'js/applications/operations/shared/relations';
import {
	HTMLUtils,
	PublicationFemale,
	withTitle,
	CreationUpdateItems,
	Row,
} from 'js/utils';
import D from '../../../../i18n/build-dictionary';

function OperationsFamilyVisualization({
	attr,
	langs: { lg1, lg2 },
	secondLang,
}) {
	return (
		<>
			<Row>
				<Note
					text={
						<ul>
							<CreationUpdateItems
								creation={attr.created}
								update={attr.modified}
							/>
							<li>
								{D1.familyStatus} : <PublicationFemale object={attr} />
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</Row>
			<Row>
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
			</Row>

			<Row>
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
			</Row>
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

export default withTitle(
	OperationsFamilyVisualization,
	D.familiesTitle + ' - ' + D.operationsTitle,
	(props) => {
		return props.attr?.prefLabelLg1;
	}
);
