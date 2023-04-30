import { useState } from 'react';
import Picker from 'js/applications/shared/picker-page';
import D from 'js/i18n';
import { CollectionExportModal } from 'js/applications/collections/modal';

const ConceptsToExport = ({ concepts, handleExportConceptListOdt, handleExportConceptListOds }) => {
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ ids, setIds] = useState([]);

	const openModal = identifiers => { 
		setIds(identifiers);
		setDisplayModal(true);
	}

	const closeModal = () => {
		setDisplayModal(false);
	}

	const handleExport = callback => (ids, _MimeType, lang, withConcepts) => {
		callback(ids, lang, withConcepts);
		closeModal();
	}

	const exportOdt = handleExport(handleExportConceptListOdt);
	const exportOds = handleExport(handleExportConceptListOds);

	return (
		<>
			{
				displayModal && <CollectionExportModal withConcepts={true} app="concepts" ids={ids} close={closeModal} exportOdt={exportOdt} exportOds={exportOds}></CollectionExportModal>
			}
			<Picker
				items={concepts}
				title={D.exportTitle}
				panelTitle={D.conceptsExportPanelTitle}
				labelWarning={D.hasNotConceptToExport}
				handleAction={openModal}
				context="concepts"
			/>
		</>
	);
}
export default ConceptsToExport;
