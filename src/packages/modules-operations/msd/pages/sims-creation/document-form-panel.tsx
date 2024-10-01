import { RightSlidingPanel } from '../../../../components/sliding-panel';
import { useCodesList } from '../../../../utils/hooks/codeslist';
import OperationsDocumentationEdition from '../../../document/edition/edition';
import { useDocumentsStoreContext } from './documents-store-context';
import './document-form-panel.scss';
import { useState } from 'react';
import { Loading } from '../../../../components';
import { getDocumentsList } from './useDocumentsList';

type DocumentFormPanelTypes = {
	opened: boolean;
	onHide: () => void;
};
export const DocumentFormPanel = ({
	opened,
	onHide,
}: Readonly<DocumentFormPanelTypes>) => {
	const langOptions = useCodesList('ISO-639');
	const { lateralPanelOpened, onLateralPanelHide, updateDocumentStores } =
		useDocumentsStoreContext();
	const [saving, setSaving] = useState(false);

	const onSave = () => {
		setSaving(true);
		getDocumentsList()
			.then((result) => updateDocumentStores(result))
			.then(() => {
				setSaving(false);
				if (onLateralPanelHide) {
					onLateralPanelHide();
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
				<Loading textType="saving" />
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
