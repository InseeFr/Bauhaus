import { useState, lazy, Suspense } from "react";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { HasAccess } from "../../../../auth/components/auth";
import type { PhysicalInstanceUpdateData } from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";

const PhysicalInstanceDialog = lazy(() =>
  import("../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog").then(
    (module) => ({ default: module.PhysicalInstanceDialog }),
  ),
);

interface PhysicalInstanceLabelProps {
  label: string;
  onSave: (data: PhysicalInstanceUpdateData) => Promise<void>;
}

export const PhysicalInstanceLabel = ({ label, onSave }: Readonly<PhysicalInstanceLabelProps>) => {
  const { t } = useTranslation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleSaveEdit = async (data: PhysicalInstanceUpdateData) => {
    try {
      await onSave(data);
      setIsEditModalVisible(false);
    } catch {
      // Keep modal open on error
      // Error handling is done by the parent component
    }
  };

  return (
    <>
      <div className="flex align-items-center gap-2 mb-3">
        <h1 className="m-0">{label}</h1>
        <HasAccess module="DDI_PHYSICALINSTANCE" privilege="UPDATE">
          <Button
            icon="pi pi-pencil"
            text
            rounded
            aria-label={t("physicalInstance.view.editTitle")}
            onClick={() => setIsEditModalVisible(true)}
          />
        </HasAccess>
      </div>

      {isEditModalVisible && (
        <Suspense fallback={null}>
          <PhysicalInstanceDialog
            visible={isEditModalVisible}
            onHide={() => setIsEditModalVisible(false)}
            mode="edit"
            initialData={{ label }}
            onSubmitEdit={handleSaveEdit}
          />
        </Suspense>
      )}
    </>
  );
};
