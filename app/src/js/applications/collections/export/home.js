import React, { useState, useCallback } from 'react';
import Picker from 'js/applications/shared/picker-page';
import D from 'js/i18n';
import ModalRmes from 'js/applications/shared/modal-rmes/modal-rmes';

const CollectionsToExport = ({ collections, handleExportCollectionList }) => {
	const [displayModal, setDisplayModal] = useState(false);
	const [ids, setIds] = useState([]);

	const handleExportCollectionListCallback = useCallback(
		(MimeType) => {
			handleExportCollectionList(ids, MimeType);
		},
		[ids, handleExportCollectionList]
	);

	const openModal = useCallback((ids) => {
		setDisplayModal(true);
		setIds(ids);
	}, []);

	const closeModal = useCallback(() => {
		setDisplayModal(false);
		setIds([]);
	}, []);

	const closeOdt = useCallback(() => {
		handleExportCollectionListCallback(
			'application/vnd.oasis.opendocument.text'
		);
		closeModal();
	}, [closeModal, handleExportCollectionListCallback]);

	const modalButtons = [
		{
			label: D.btnCancel,
			action: closeModal,
			style: 'default',
		},
		{
			label: D.btnOdt,
			action: closeOdt,
			style: 'primary',
		},
	];

	return (
		<div>
			<ModalRmes
				id="export-concept-modal"
				isOpen={displayModal}
				title={D.exportModalTitle}
				body={D.exportModalBody}
				modalButtons={modalButtons}
				closeCancel={closeModal}
			/>
			<Picker
				items={collections}
				title={D.exportTitle}
				panelTitle={D.collectionsExportPanelTitle}
				labelWarning={D.hasNotCollectionToExport}
				handleAction={openModal}
				context="collections"
			/>
		</div>
	);
};

export default CollectionsToExport;
