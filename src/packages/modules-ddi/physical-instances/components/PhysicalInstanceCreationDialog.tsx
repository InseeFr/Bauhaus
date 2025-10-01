import { FormEvent, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import './PhysicalInstanceCreationDialog.css';

interface PhysicalInstanceCreationDialogProps {
	visible: boolean;
	onHide: () => void;
	onSubmit: (data: { label: string; name: string }) => void;
}

export const PhysicalInstanceCreationDialog = ({
	visible,
	onHide,
	onSubmit,
}: PhysicalInstanceCreationDialogProps) => {
	const { t } = useTranslation();
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = {
			label: formData.get('label') as string,
			name: formData.get('name') as string,
		};
		onSubmit(data);
		formRef.current?.reset();
	};

	const handleHide = () => {
		formRef.current?.reset();
		onHide();
	};

	return (
		<Dialog
			header={t('physicalInstance.creation.title')}
			visible={visible}
			onHide={handleHide}
			className="ddi physical-instance-creation-dialog"
		>
			<form ref={formRef} onSubmit={handleSubmit} className="flex flex-column gap-2">
				<div className="flex flex-column gap-2">
					<label htmlFor="label">{t('physicalInstance.creation.label')}</label>
					<InputText id="label" name="label" />
				</div>
				<div className="flex flex-column gap-2">
					<label htmlFor="name">{t('physicalInstance.creation.name')}</label>
					<InputText id="name" name="name" />
				</div>
				<div className="dialog-footer">
					<Button label={t('physicalInstance.creation.cancel')} type="button" outlined onClick={handleHide} type="button" />
					<Button label={t('physicalInstance.creation.create')} type="submit" className="create-button" />
				</div>
			</form>
		</Dialog>
	);
};
