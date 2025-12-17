import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";

interface PhysicalInstancesDataTableProps {
	variables: any[];
	onRowClick?: (data: any) => void;
	onDeleteClick?: (data: any) => void;
	unsavedVariableIds?: string[];
}

export const PhysicalInstancesDataTable = ({
	variables,
	onRowClick,
	onDeleteClick,
	unsavedVariableIds = [],
}: Readonly<PhysicalInstancesDataTableProps>) => {
	const { t } = useTranslation();

	const rowClassName = (rowData: any) => {
		return unsavedVariableIds.includes(rowData.id) ? "font-italic" : "";
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	const dateBodyTemplate = (rowData: any) => {
		return formatDate(rowData.lastModified);
	};

	const deleteBodyTemplate = (rowData: any) => (
		<Button
			icon="pi pi-trash"
			rounded
			text
			severity="danger"
			onClick={(e) => {
				e.stopPropagation();
				onDeleteClick?.(rowData);
			}}
			aria-label={t("physicalInstance.view.delete")}
		/>
	);

	return (
		<DataTable
			value={variables}
			stripedRows
			aria-label={t("physicalInstance.view.variablesTable")}
			onRowClick={(e) => onRowClick?.(e.data)}
			selectionMode="single"
			rowClassName={rowClassName}
		>
			<Column field="name" header={t("physicalInstance.view.columns.name")} />
			<Column
				field="label"
				header={t("physicalInstance.view.columns.label")}
			/>
			<Column field="type" header={t("physicalInstance.view.columns.type")} />
			<Column
				field="lastModified"
				header={t("physicalInstance.view.columns.lastModified")}
				body={dateBodyTemplate}
			/>
			<Column body={deleteBodyTemplate} style={{ width: "5rem" }} />
		</DataTable>
	);
};
