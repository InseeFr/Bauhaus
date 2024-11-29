import { CreationUpdateItems } from '@components/creation-update-items';
import { Row } from '@components/layout';
import { Note } from '@components/note';
import { PublicationFemale } from '@components/status';

import { useTitle } from '@utils/hooks/useTitle';

import { D1, D2 } from '../../../deprecated-locales';
import D from '../../../deprecated-locales/build-dictionary';
import RelationsView from '../../shared/relations';

function OperationsOperationVisualization({ attr, secondLang }) {
	useTitle(D.operationsTitle, attr?.prefLabelLg1);

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
								{D1.operationStatus} : <PublicationFemale object={attr} />
							</li>
							<li>
								{D.year} : {attr.year}
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</Row>
			<Row>
				<Note
					text={attr.altLabelLg1}
					title={D1.altLabel}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={attr.altLabelLg2}
						title={D2.altLabel}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<RelationsView
				parent={attr.series}
				parentTitle="parentSeries"
				parentPath="series"
				title="linksTitle"
				secondLang={secondLang}
			/>
		</>
	);
}

export default OperationsOperationVisualization;
