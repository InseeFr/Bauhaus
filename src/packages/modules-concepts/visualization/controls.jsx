import { useCallback, useState } from 'react';
import check from '../../auth/auth';
import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	ExportButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import D from '../../deprecated-locales';
import { ConceptsApi } from '../../sdk';
import { saveFileFromHttpResponse } from '../../utils/files';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { useLoading } from './loading';
import { ConfirmationDelete } from '@components/confirmation-delete';
const ConceptVisualizationControls = ({
	isValidated,
	isValidOutOfDate,
	conceptVersion,
	id,
	permission: { authType, roles, stamp },
	creator: conceptCreator,
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

	const authImpl = check(authType);
	const admin = authImpl.isAdmin(roles);
	const contributor = authImpl.isContributor(roles, stamp, conceptCreator);
	const creator = authImpl.isConceptCreator(roles, stamp, conceptCreator);
	const adminOrCreator = admin || creator;

	let btns;

	const validate = adminOrCreator && [handleValidation, D.btnValid];
	const update = <UpdateButton action={`/concepts/${id}/modify`} />;
	const compare =
		!conceptVersion || conceptVersion <= 1
			? null
			: [`/concepts/${id}/compare`, D.btnCompare];
	const erase = adminOrCreator && [() => setModalOpened(true), D.btnDelete];

	const exportConcept = (
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
	);

	if (admin || (creator && contributor)) {
		if (isValidOutOfDate) {
			btns = isValidated
				? [compare, exportConcept, erase]
				: [compare, exportConcept, update, validate, erase];
		} else {
			btns = isValidated
				? [compare, exportConcept, update, erase]
				: [compare, exportConcept, update, validate, erase];
		}
	} else if (contributor) {
		if (isValidOutOfDate) {
			btns = isValidated
				? [compare, exportConcept]
				: [compare, exportConcept, update];
		} else {
			btns = [compare, exportConcept, update];
		}
	} else if (creator) {
		btns = isValidated
			? [compare, exportConcept, update]
			: [compare, exportConcept, update, validate];
	} else {
		btns = [compare, exportConcept];
	}

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
				{btns.map((btn) => {
					if (!btn) return null;

					if (!Array.isArray(btn)) {
						return btn;
					}
					const [action, label] = btn;
					return <Button key={label} action={action} label={label} />;
				})}
			</ActionToolbar>
		</>
	);
};

export default ConceptVisualizationControls;
