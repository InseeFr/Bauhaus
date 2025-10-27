import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import './ImportModal.css';

interface ImportModalProps {
	visible: boolean;
	onHide: () => void;
	importData: string;
	onImportDataChange: (data: string) => void;
	onImport: () => void;
}

export const ImportModal = ({
	visible,
	onHide,
	importData,
	onImportDataChange,
	onImport,
}: Readonly<ImportModalProps>) => {
	const { t } = useTranslation();

	return (
		<Dialog
			header={t('physicalInstance.view.importModal.title')}
			visible={visible}
			onHide={onHide}
			className="ddi physical-import-dialog"
		>
			<form className="flex flex-column gap-3">
				<InputTextarea
					value={importData}
					onChange={(e) => onImportDataChange(e.target.value)}
					rows={10}
					className="w-full"
					placeholder={t('physicalInstance.view.importModal.placeholder')}
				/>
				<div className="flex justify-content-end gap-2">
					<Button
						label={t('physicalInstance.view.importModal.cancel')}
						outlined
						type="button"
						onClick={onHide}
					/>
					<Button
						label={t('physicalInstance.view.importModal.import')}
						onClick={onImport}
						type="submit"
						className="create-button"
					/>
				</div>
			</form>
		</Dialog>
	);
};
