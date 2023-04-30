import React, { useState, useCallback } from 'react';
import Picker from 'js/applications/shared/picker-page';
import D from 'js/i18n';
import { CollectionExportModal } from '../modal';

const CollectionsToExport = ({ collections, exportOdt, exportOds }) => {
	const [displayModal, setDisplayModal] = useState(false);
	const [ids, setIds] = useState([]);

	const openModal = useCallback((ids) => {
		setDisplayModal(true);
		setIds(ids);
	}, []);

	const closeModal = useCallback(() => {
		setDisplayModal(false);
	}, []);

	return (

		<div>
			{
				displayModal && <CollectionExportModal app="concepts" ids={ids} close={closeModal} exportOdt={exportOdt} exportOds={exportOds}></CollectionExportModal>
			}

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
