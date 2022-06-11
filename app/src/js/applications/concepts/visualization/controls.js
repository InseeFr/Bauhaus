import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { goBack, Button, ActionToolbar, getContentDisposition } from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import { ConfirmationDelete } from 'bauhaus-utilities';
import ModalRmes from '../../shared/modal-rmes/modal-rmes';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';

const ConceptVisualizationControls = (props) => {
	const {
		isValidated,
		isValidOutOfDate,
		conceptVersion,
		id,
		permission: { authType, roles, stamp },
		creator: conceptCreator,
		handleValidation,
		handleDeletion,
	} = props;

	const [displayModal, setDisplayModal] = useState(false);
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

	const cancel = [goBack(props, `/concepts`), D.btnReturn];
	const validate = adminOrCreator && [handleValidation, D.btnValid];
	const update = [`/concept/${id}/modify`, D.btnUpdate];
	const compare =
		!conceptVersion || conceptVersion <= 1
			? null
			: [`/concept/${id}/compare`, D.btnCompare];
	const erase = adminOrCreator && [() => setModalOpened(true), D.btnDelete];
	const exportConcept = [() => setDisplayModal(true), D.btnExporter];

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
		btns = [cancel, compare];
	}

	const modalButtons = [
		{
			label: D.btnCancel,
			action: () => setDisplayModal(false),
			style: 'default',
		},
		{
			label: D.btnOdt,
			action: () => {
				let fileName;
				return api
					.getConceptExport(id, 'application/vnd.oasis.opendocument.text')
					.then(res => {
						fileName = getContentDisposition(
							res.headers.get('Content-Disposition')
						)[1];
						return res;
					})
					.then(res => res.blob())
					.then(blob => {
						return FileSaver.saveAs(blob, fileName);
					})
					.finally(() => {
						setDisplayModal(false)
					})
			},
			style: 'primary',
		},
	];

	return (
		<>
			<ModalRmes
				id="export-concept-modal"
				isOpen={displayModal}
				title={D.exportModalTitle}
				body={D.exportModalBody}
				modalButtons={modalButtons}
				closeCancel={() => setDisplayModal(false)}
			/>
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

ConceptVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	permission: permissionOverviewPropTypes,
	creator: PropTypes.string.isRequired,
	isValidated: PropTypes.bool.isRequired,
	conceptVersion: PropTypes.string.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(ConceptVisualizationControls);
