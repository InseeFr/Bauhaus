import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import './EditModal.css';

interface EditModalProps {
	visible: boolean;
	onHide: () => void;
	formData: { label: string; name: string };
	onFormDataChange: (data: { label: string; name: string }) => void;
	onSave: () => void;
}

export const EditModal = ({
	visible,
	onHide,
	formData,
	onFormDataChange,
	onSave,
}: Readonly<EditModalProps>) => {
	const { t } = useTranslation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave();
	};

	return (
		<Dialog
			header={t('physicalInstance.view.editModal.title')}
			visible={visible}
			onHide={onHide}
			className="ddi physical-instance-update-dialog"
		>
			<form className="flex flex-column gap-3" onSubmit={handleSubmit}>
				<div className="flex flex-column gap-2">
					<label htmlFor="name">
						{t('physicalInstance.view.editModal.name')}
					</label>
					<InputText
						id="name"
						value={formData.name}
						onChange={(e) =>
							onFormDataChange({ ...formData, name: e.target.value })
						}
					/>
				</div>
				<div className="flex flex-column gap-2">
					<label htmlFor="label">
						{t('physicalInstance.view.editModal.label')}
					</label>
					<InputText
						id="label"
						value={formData.label}
						onChange={(e) =>
							onFormDataChange({ ...formData, label: e.target.value })
						}
					/>
				</div>
				<div className="flex justify-content-end gap-2 mt-3">
					<Button
						label={t('physicalInstance.view.editModal.cancel')}
						outlined
						onClick={onHide}
						type="button"
					/>
					<Button
						label={t('physicalInstance.view.editModal.save')}
						type="submit"
						className="create-button"
					/>
				</div>
			</form>
		</Dialog>
	);
};
