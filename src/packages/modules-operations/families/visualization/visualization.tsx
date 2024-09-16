import { D1, D2 } from '../../../deprecated-locales';
import RelationsView from '../../../modules-operations/shared/relations';
import D from '../../../deprecated-locales/build-dictionary';
import {
	PublicationFemale,
	Row,
	CreationUpdateItems,
} from '../../../components';
import { renderMarkdownElement } from '../../../utils/html-utils';
import { useTitle } from '../../../utils/hooks/useTitle';
import React from 'react';

type OperationsFamilyVisualizationTypes = {
	attr: any;
	langs: { lg1: string; lg2: string };
	secondLang: boolean;
};
function OperationsFamilyVisualization({
	attr,
	langs: { lg1, lg2 },
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
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(attr.abstractLg2)}
						title={D2.summary}
						lang={lg2}
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
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
			/>
		</>
	);
}

export default OperationsFamilyVisualization;
