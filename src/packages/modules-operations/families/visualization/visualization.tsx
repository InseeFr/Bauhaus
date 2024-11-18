import { CreationUpdateItems } from '@components/creation-update-items';
import { Row } from '@components/layout';
import { Note } from '@components/note';
import { PublicationFemale } from '@components/status';
import { D1, D2 } from '../../../deprecated-locales';
import D from '../../../deprecated-locales/build-dictionary';
import { Family } from '../../../model/operations/family';
import RelationsView from '../../../modules-operations/shared/relations';
import { useTitle } from '../../../utils/hooks/useTitle';
import { renderMarkdownElement } from '../../../utils/html-utils';

type OperationsFamilyVisualizationTypes = {
	attr: Family;
	secondLang: boolean;
};
function OperationsFamilyVisualization({
	attr,
	secondLang,
}: Readonly<OperationsFamilyVisualizationTypes>) {
	useTitle(D.familiesTitle + ' - ' + D.operationsTitle, attr?.prefLabelLg1);

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
					text={renderMarkdownElement(attr.abstractLg1)}
					title={D1.summary}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(attr.abstractLg2)}
						title={D2.summary}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<RelationsView
				children={attr.series}
				childrenTitle="childrenSeries"
				childrenPath="series"
				title="linksTitle"
				secondLang={secondLang}
			/>
		</>
	);
}

export default OperationsFamilyVisualization;
