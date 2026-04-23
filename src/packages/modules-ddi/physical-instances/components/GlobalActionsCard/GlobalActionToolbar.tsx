import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "primereact/menuitem";
import { HasAccess } from "../../../../auth/components/auth";

interface GlobalActionToolbarProps {
  onExport: (format: "DDI3" | "DDI4") => void;
  onDuplicate?: () => void;
}

export const GlobalActionToolbar = ({
  onExport,
  onDuplicate,
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
      <HasAccess module="DDI_PHYSICALINSTANCE" privilege="CREATE">
        <Button
          icon="pi pi-copy"
          label={t("physicalInstance.view.duplicatePhysicalInstance")}
          severity="secondary"
          style={{ background: "transparent" }}
          aria-label={t("physicalInstance.view.duplicatePhysicalInstance")}
          onClick={onDuplicate}
        />
      </HasAccess>
    </div>
  );
};
