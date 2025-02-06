import { useCallback, useState } from 'react';

import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	ExportButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ConfirmationDelete } from '@components/confirmation-delete';

import check from '../../auth/auth';
import D from '../../deprecated-locales';
import { ConceptsApi } from '../../sdk';
import { saveFileFromHttpResponse } from '../../utils/files';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { useLoading } from './loading';

const ConceptCompareButton = ({ conceptVersion, id }) => {
	if (!conceptVersion || conceptVersion <= 1) {
		return null;
	}

	return <Button action={`/concepts/${id}/compare`} label={D.btnCompare} />;
};
const ConceptVisualizationControls = ({
	isValidated,
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

	let btns = [];

	const validate = adminOrCreator && [handleValidation, D.btnValid];
	const update = <UpdateButton action={`/concepts/${id}/modify`} />;

	const erase = adminOrCreator && [() => setModalOpened(true), D.btnDelete];

	if (admin || (creator && contributor)) {
		btns = isValidated ? [update, erase] : [update, validate, erase];
	} else if (contributor) {
		btns = [update];
	} else if (creator) {
		btns = isValidated ? [update] : [update, validate];
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
				<ConceptCompareButton id={id} conceptVersion={conceptVersion} />
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
