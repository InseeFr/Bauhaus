import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";
import { GlobalActionToolbar } from "./GlobalActionToolbar";
import { PhysicalInstancesDataTable } from "./PhysicalInstancesDataTable";

interface GlobalActionsCardProps {
	variables: any[];
	onExport: (format: "DDI3" | "DDI4") => void;
	onRowClick?: (data: any) => void;
	onDeleteClick?: (data: any) => void;
	unsavedVariableIds?: string[];
}

export const GlobalActionsCard = ({
	variables,
	onExport,
	onRowClick,
	onDeleteClick,
	unsavedVariableIds = [],
}: Readonly<GlobalActionsCardProps>) => {
	const { t } = useTranslation();

	return (
		<Card title={t("physicalInstance.view.globalActions")}>
			<GlobalActionToolbar onExport={onExport} />
			<PhysicalInstancesDataTable
				variables={variables}
				onRowClick={onRowClick}
				onDeleteClick={onDeleteClick}
				unsavedVariableIds={unsavedVariableIds}
			/>
		</Card>
	);
};
