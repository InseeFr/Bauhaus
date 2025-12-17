import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "primereact/menuitem";

interface GlobalActionToolbarProps {
	onExport: (format: "DDI3" | "DDI4") => void;
}

export const GlobalActionToolbar = ({
	onExport,
}: Readonly<GlobalActionToolbarProps>) => {
	const { t } = useTranslation();

	const exportMenuItems: MenuItem[] = [
		{
			label: "DDI 3.3",
			icon: "pi pi-file",
			command: () => onExport("DDI3"),
		},
		{
			label: "DDI 4.0/JSON",
			icon: "pi pi-file",
			command: () => onExport("DDI4"),
		},
	];

	return (
		<div className="flex gap-2 flex-wrap mb-4">
			<SplitButton
				icon="pi pi-download"
				label={t("physicalInstance.view.export")}
				model={exportMenuItems}
				severity="secondary"
				buttonProps={{
					style: { background: "transparent" },
				}}
				menuButtonProps={{
					style: { background: "transparent" },
				}}
				aria-label={t("physicalInstance.view.export")}
				onClick={() => onExport("DDI3")}
			/>
			<Button
				icon="pi pi-send"
				label={t("physicalInstance.view.publish")}
				severity="secondary"
				style={{ background: "transparent" }}
				aria-label={t("physicalInstance.view.publish")}
			/>
		</div>
	);
};
