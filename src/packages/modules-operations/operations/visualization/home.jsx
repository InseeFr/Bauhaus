import { D1, D2 } from '../../../deprecated-locales';
import RelationsView from '../../../modules-operations/shared/relations';
import D from '../../../deprecated-locales/build-dictionary';
import {
	PublicationFemale,
	Row,
	CreationUpdateItems,
} from '../../../components';
import { useTitle } from '../../../utils/hooks/useTitle';
import { Note } from '../../../components/note';

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
