import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';

interface GlobalActionsCardProps {
	variables: any[];
	onImport: () => void;
	onExport: () => void;
	onRowClick?: (data: any) => void;
}

export const GlobalActionsCard = ({
	variables,
	onImport,
	onExport,
	onRowClick,
}: Readonly<GlobalActionsCardProps>) => {
	const { t } = useTranslation();

	return (
		<Card title={t('physicalInstance.view.globalActions')}>
			<div className="flex gap-2 flex-wrap mb-4">
				<Button
					icon="pi pi-upload"
					label={t('physicalInstance.view.import')}
					severity="secondary"
					style={{ background: 'transparent' }}
					aria-label={t('physicalInstance.view.import')}
					onClick={onImport}
				/>
				<Button
					icon="pi pi-download"
					label={t('physicalInstance.view.export')}
					severity="secondary"
					style={{ background: 'transparent' }}
					aria-label={t('physicalInstance.view.export')}
					onClick={onExport}
				/>
				<Button
					icon="pi pi-pencil"
					label={t('physicalInstance.view.bulkEdit')}
					severity="secondary"
					style={{ background: 'transparent' }}
					aria-label={t('physicalInstance.view.bulkEdit')}
				/>
				<Button
					icon="pi pi-send"
					label={t('physicalInstance.view.publish')}
					severity="secondary"
					style={{ background: 'transparent' }}
					aria-label={t('physicalInstance.view.publish')}
				/>
			</div>
			<DataTable
				value={variables}
				stripedRows
				aria-label={t('physicalInstance.view.variablesTable')}
				onRowClick={(e) => onRowClick?.(e.data)}
				selectionMode="single"
			>
				<Column field="name" header={t('physicalInstance.view.columns.name')} />
				<Column
					field="label"
					header={t('physicalInstance.view.columns.label')}
				/>
				<Column field="type" header={t('physicalInstance.view.columns.type')} />
				<Column
					field="lastModified"
					header={t('physicalInstance.view.columns.lastModified')}
				/>
			</DataTable>
		</Card>
	);
};
