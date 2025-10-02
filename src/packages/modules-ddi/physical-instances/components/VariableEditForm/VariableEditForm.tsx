import { useCallback, useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

interface VariableEditFormProps {
	variable: {
		id: string;
		label: string;
		name: string;
		type: string;
	};
	typeOptions: Array<{ label: string; value: string }>;
	onSave: (data: { id: string; label: string; name: string; type: string }) => void;
}

export const VariableEditForm = ({
	variable,
	typeOptions,
	onSave,
}: Readonly<VariableEditFormProps>) => {
	const { t } = useTranslation();
	const [label, setLabel] = useState(variable.label);
	const [name, setName] = useState(variable.name);
	const [selectedType, setSelectedType] = useState(variable.type);

	useEffect(() => {
		setLabel(variable.label);
		setName(variable.name);
		setSelectedType(variable.type);
	}, [variable.id, variable.label, variable.name, variable.type]);

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			onSave({
				id: variable.id,
				label,
				name,
				type: selectedType,
			});
		},
		[variable.id, label, name, selectedType, onSave],
	);

	return (
		<Card
			title={t('physicalInstance.view.editVariable')}
			className="h-full"
		>
			<form onSubmit={handleSubmit} className="flex flex-column gap-3">
				<div className="flex gap-2 justify-content-end">
					<Button
						type="submit"
						label={t('physicalInstance.view.save')}
						outlined
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
						onChange={(e) => setLabel(e.target.value)}
						required
					/>
				</div>

				<div className="flex flex-column gap-2">
					<label htmlFor="variable-name">
						{t('physicalInstance.view.columns.name')}
					</label>
					<InputText
						id="variable-name"
						name="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div className="flex flex-column gap-2">
					<label htmlFor="variable-type">
						{t('physicalInstance.view.columns.type')}
					</label>
					<Dropdown
						id="variable-type"
						name="type"
						value={selectedType}
						onChange={(e) => setSelectedType(e.value)}
						options={typeOptions}
						placeholder={t('physicalInstance.view.selectType')}
						required
					/>
				</div>
			</form>
		</Card>
	);
};
