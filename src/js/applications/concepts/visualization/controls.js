import { useCallback, useState } from 'react';
import { Button, ActionToolbar } from '@inseefr/wilco';
import check from '../../../new-architecture/auth/auth';
import D from '../../../i18n';
import { ConfirmationDelete } from '../../../utils';
import { useLoading } from './loading';
import { useGoBack } from '../../../new-architecture/utils/hooks/useGoBack';
import { saveFileFromHttpResponse } from '../../../new-architecture/utils/files';
import { ConceptsApi } from '../../../new-architecture/sdk';
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

	const cancel = [() => goBack(`/concepts`), D.btnReturn];
	const validate = adminOrCreator && [handleValidation, D.btnValid];
	const update = [`/concept/${id}/modify`, D.btnUpdate];
	const compare =
		!conceptVersion || conceptVersion <= 1
			? null
			: [`/concept/${id}/compare`, D.btnCompare];
	const erase = adminOrCreator && [() => setModalOpened(true), D.btnDelete];

	const exportConcept = [
		() => {
			setLoading('exporting');
			return ConceptsApi.getConceptExport(
				id,
				'application/vnd.oasis.opendocument.text'
			)
				.then(saveFileFromHttpResponse)
				.finally(() => setLoading());
		},
		D.btnExporter,
	];

	if (admin || (creator && contributor)) {
		if (isValidOutOfDate) {
			btns = isValidated
				? [cancel, compare, exportConcept, erase]
				: [cancel, compare, exportConcept, update, validate, erase];
		} else {
			btns = isValidated
				? [cancel, compare, exportConcept, update, erase]
				: [cancel, compare, exportConcept, update, validate, erase];
		}
	} else if (contributor) {
		if (isValidOutOfDate) {
			btns = isValidated
				? [cancel, compare, exportConcept]
				: [cancel, compare, exportConcept, update];
		} else {
			btns = [cancel, compare, exportConcept, update];
		}
	} else if (creator) {
		btns = isValidated
			? [cancel, compare, exportConcept, update]
			: [cancel, compare, exportConcept, update, validate];
	} else {
		btns = [cancel, compare, exportConcept];
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
				{btns.map((btn) => {
					if (!btn) return null;
					const [action, label] = btn;
					return btn && <Button key={label} action={action} label={label} />;
				})}
			</ActionToolbar>
		</>
	);
};

export default ConceptVisualizationControls;
