import { useCallback, useState } from 'react';

import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	ExportButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ConfirmationDelete } from '@components/confirmation-delete';

import { HasAccess } from '../../auth/components/auth';
import D from '../../deprecated-locales';
import { ConceptsApi } from '../../sdk';
import { saveFileFromHttpResponse } from '../../utils/files';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { useLoading } from './loading';

const ConceptVisualizationControls = ({
	isValidated,
	conceptVersion,
	id,
	handleValidation,
	handleDeletion,
}) => {
	const { setLoading } = useLoading();
	const goBack = useGoBack();

	const [modalOpened, setModalOpened] = useState(false);
	const handleNo = useCallback(() => {
		setModalOpened(false);
	}, []);
	const handleYes = useCallback(() => {
		handleDeletion();
		setModalOpened(false);
	}, [handleDeletion]);

	return (
		<>
			{modalOpened && (
				<ConfirmationDelete
					className="concepts"
					handleNo={handleNo}
					handleYes={handleYes}
				/>
			)}
			<ActionToolbar>
				<ReturnButton action={() => goBack(`/concepts`)} />
				<HasAccess
					module="CONCEPT_CONCEPT"
					privilege="READ"
					complementaryCheck={conceptVersion > 1}
				>
					<Button action={`/concepts/${id}/compare`} label={D.btnCompare} />
				</HasAccess>
				<ExportButton
					action={() => {
						setLoading('exporting');
						return ConceptsApi.getConceptExport(
							id,
							'application/vnd.oasis.opendocument.text',
						)
							.then(saveFileFromHttpResponse)
							.finally(() => setLoading());
					}}
				/>
				<HasAccess module="CONCEPT_CONCEPT" privilege="UPDATE">
					<UpdateButton action={`/concepts/${id}/modify`} />
				</HasAccess>

				<HasAccess module="CONCEPT_CONCEPT" privilege="DELETE">
					<Button action={() => setModalOpened(true)} label={D.btnDelete} />
				</HasAccess>

				<HasAccess
					module="CONCEPT_CONCEPT"
					privilege="PUBLISH"
					complementaryCheck={!isValidated}
				>
					<Button action={handleValidation} label={D.btnValid} />
				</HasAccess>
			</ActionToolbar>
		</>
	);
};

export default ConceptVisualizationControls;
