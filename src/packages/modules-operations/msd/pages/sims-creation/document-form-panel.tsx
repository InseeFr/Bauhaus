import { useState } from 'react';

import { Saving } from '@components/loading';
import { RightSlidingPanel } from '@components/sliding-panel';

import { useCodesList } from '@utils/hooks/codeslist';

import { Document } from '../../../../model/operations/document';
import OperationsDocumentationEdition from '../../../document/edition/edition';
import './document-form-panel.css';
import { useDocumentsStoreContext } from './documents-store-context';
import { getDocumentsList } from './useDocumentsList';

interface DocumentFormPanelTypes {
	opened: boolean;
	onHide: VoidFunction;
	onAdd: (rubric?: string, lang?: string, documentId?: string) => void;
}
export const DocumentFormPanel = ({
	opened,
	onHide,
	onAdd,
}: Readonly<DocumentFormPanelTypes>) => {
	const langOptions = useCodesList('ISO-639');
	const {
		lateralPanelOpened,
		onLateralPanelHide,
		updateDocumentStores,
		rubricIdForNewDocument,
	} = useDocumentsStoreContext();
	const [saving, setSaving] = useState(false);

	const onSave = (id: string) => {
		setSaving(true);
		getDocumentsList().then((result) => {
			updateDocumentStores(result);
			setSaving(false);
			if (onLateralPanelHide) {
				onLateralPanelHide();
				const newDocument = result[
					rubricIdForNewDocument?.lang.toLowerCase() as 'lg1' | 'lg2'
				].find((d: Document) => {
					return d.id == id;
				});
				onAdd(
					rubricIdForNewDocument?.rubric,
					rubricIdForNewDocument?.lang.toLowerCase(),
					newDocument,
				);
			}
		});
	};

	return (
		<RightSlidingPanel
			isOpen={opened}
			backdropClicked={onHide}
			panelClassName="documents-form-panel"
		>
			{saving ? (
				<Saving />
			) : (
				<OperationsDocumentationEdition
					document={{}}
					langOptions={langOptions}
					type={lateralPanelOpened}
					onCancel={onLateralPanelHide}
					onSave={onSave}
				/>
			)}
		</RightSlidingPanel>
	);
};
