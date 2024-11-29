import { CreationUpdateItems } from '@components/creation-update-items';
import { Row } from '@components/layout';
import { Note } from '@components/note';
import { PublicationFemale } from '@components/status';

import { useTitle } from '@utils/hooks/useTitle';

import { D1, D2 } from '../../../deprecated-locales';
import D from '../../../deprecated-locales/build-dictionary';
<<<<<<< HEAD:src/packages/modules-operations/operations/visualization/home.jsx
import RelationsView from '../../shared/relations';
=======
import {
	PublicationFemale,
	Row,
	CreationUpdateItems,
} from '../../../components';
import { useTitle } from '../../../utils/hooks/useTitle';
import { Note } from '../../../components/note';
import { Operation } from '../../../model/Operation';
>>>>>>> d60f6cf8 (feat: add unit test):src/packages/modules-operations/operations/visualization/home.tsx

type OperationsOperationVisualizationTypes = {
	attr: Operation;
	secondLang: boolean;
};
function OperationsOperationVisualization({
	attr,
	secondLang,
}: Readonly<OperationsOperationVisualizationTypes>) {
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
