import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useTranslation } from 'react-i18next';

interface VariableInformationTabProps {
	name: string;
	label: string;
	description: string;
	onNameChange: (value: string) => void;
	onLabelChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
}

export const VariableInformationTab = ({
	name,
	label,
	description,
	onNameChange,
	onLabelChange,
	onDescriptionChange,
}: Readonly<VariableInformationTabProps>) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-column gap-3">
			<div className="flex flex-column gap-2">
				<label htmlFor="variable-name">
					{t('physicalInstance.view.columns.name')}
				</label>
				<InputText
					id="variable-name"
					name="name"
					value={name}
					onChange={(e) => onNameChange(e.target.value)}
					required
				/>
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="variable-label">
					{t('physicalInstance.view.columns.label')}
				</label>
				<InputText
					id="variable-label"
					name="label"
					value={label}
					onChange={(e) => onLabelChange(e.target.value)}
					required
				/>
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="variable-description">
					{t('physicalInstance.view.columns.description')}
				</label>
				<InputTextarea
					id="variable-description"
					name="description"
					value={description}
					onChange={(e) => onDescriptionChange(e.target.value)}
					rows={5}
				/>
			</div>
		</div>
	);
};
