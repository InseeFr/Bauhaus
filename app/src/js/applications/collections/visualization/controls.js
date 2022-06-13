import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ActionToolbar, Button, getContentDisposition } from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import ModalRmes from '../../shared/modal-rmes/modal-rmes';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';

const CollectionVisualizationControls = ({
		 isValidated,
		 permission: { authType, roles, stamp },
		 creator: collectionCreator,
		 id,
		 handleValidation,
	 }) => {

	const [displayModal, setDisplayModal] = useState(false);

	const authImpl = check(authType);
	const admin = authImpl.isAdmin(roles);
	const contributor = authImpl.isContributor(roles, stamp, collectionCreator);
	const creator = authImpl.isCollectionCreator(
		roles,
		stamp,
		collectionCreator,
	);

	let btns;

	const exportConcept = [() => setDisplayModal(true), D.btnExporter];
	const cancel = [`/collections`, D.btnReturn];
	const validate = [handleValidation, D.btnValid];
	const update = [`/collection/${id}/modify`, D.btnUpdate];

	if (admin || creator) {
		btns = isValidated
			? [cancel, exportConcept, update]
			: [cancel, exportConcept, update, validate];
	} else if (contributor) {
		btns = [cancel, exportConcept, update];
	} else {
		btns = [cancel];
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
					.getCollectionExport(id, 'application/vnd.oasis.opendocument.text')
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
			<ActionToolbar>
				{btns.map((btn, i) => {
					if (!btn) return null;
					const [action, label] = btn;
					return btn && <Button key={label} action={action} label={label} />;
				})}
			</ActionToolbar>
		</>
	);
};

CollectionVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	permission: permissionOverviewPropTypes.isRequired,
	isValidated: PropTypes.bool.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(CollectionVisualizationControls);
