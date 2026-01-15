import { FormEvent, useRef, useState, useMemo, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useGroups } from "../../../hooks/useGroups";
import { useGroupDetails } from "../../../hooks/useGroupDetails";
import "./PhysicalInstanceCreationDialog.css";

interface SelectedGroup {
  id: string;
  agency: string;
}

interface SelectedStudyUnit {
  id: string;
  agency: string;
}

export interface PhysicalInstanceCreationData {
  label: string;
  name: string;
  group: SelectedGroup;
  studyUnit: SelectedStudyUnit;
}

export interface PhysicalInstanceUpdateData {
  label: string;
  name: string;
  group: SelectedGroup;
  studyUnit: SelectedStudyUnit;
}

interface PhysicalInstanceDialogProps {
  visible: boolean;
  onHide: () => void;
  mode: "create" | "edit";
  initialData?: { label: string };
  onSubmitCreate?: (data: PhysicalInstanceCreationData) => Promise<void>;
  onSubmitEdit?: (data: PhysicalInstanceUpdateData) => Promise<void>;
}

export const PhysicalInstanceDialog = ({
  visible,
  onHide,
  mode,
  initialData,
  onSubmitCreate,
  onSubmitEdit,
}: PhysicalInstanceDialogProps) => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedStudyUnitId, setSelectedStudyUnitId] = useState<string | null>(null);
  const [label, setLabel] = useState("");

  const isCreateMode = mode === "create";

  const { data: groups = [], isLoading: isLoadingGroups } = useGroups();

  const selectedGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    const group = groups.find((g) => g.id === selectedGroupId);
    return group ? { id: group.id, agency: group.agency } : null;
  }, [selectedGroupId, groups]);

  const { data: groupDetails, isLoading: isLoadingStudyUnits } = useGroupDetails(
    selectedGroup?.agency ?? null,
    selectedGroup?.id ?? null,
  );

  const groupOptions = useMemo(() => {
    return groups.map((group) => ({
      label: group.label,
      value: group.id,
    }));
  }, [groups]);

  const studyUnitOptions = useMemo(() => {
    if (!groupDetails?.StudyUnit) return [];
    return groupDetails.StudyUnit.map((su) => ({
      label: su.Citation.Title.String["#text"],
      value: su.ID,
    }));
  }, [groupDetails]);

  const selectedStudyUnit = useMemo(() => {
    if (!selectedStudyUnitId || !groupDetails?.StudyUnit) return null;
    const su = groupDetails.StudyUnit.find((s) => s.ID === selectedStudyUnitId);
    return su ? { id: su.ID, agency: su.Agency } : null;
  }, [selectedStudyUnitId, groupDetails]);

  const isFormValid = label.trim() && selectedGroup && selectedStudyUnit;

  useEffect(() => {
    if (visible && initialData) {
      setLabel(initialData.label);
    }
  }, [visible, initialData]);

  const handleGroupChange = (value: string | null) => {
    setSelectedGroupId(value);
    setSelectedStudyUnitId(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      if (isCreateMode && onSubmitCreate) {
        const data: PhysicalInstanceCreationData = {
          label: label,
          name: "DataRelationShip Name:" + label,
          group: selectedGroup!,
          studyUnit: selectedStudyUnit!,
        };
        await onSubmitCreate(data);
      } else if (!isCreateMode && onSubmitEdit) {
        const data: PhysicalInstanceUpdateData = {
          label: label,
          name: "DataRelationShip Name:" + label,
          group: selectedGroup!,
          studyUnit: selectedStudyUnit!,
        };
        await onSubmitEdit(data);
      }
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    formRef.current?.reset();
    setLabel("");
    setSelectedGroupId(null);
    setSelectedStudyUnitId(null);
  };

  const handleHide = () => {
    if (isSubmitting) return;
    resetForm();
    onHide();
  };

  const dialogTitle = isCreateMode
    ? t("physicalInstance.creation.title")
    : t("physicalInstance.view.editModal.title");

  const submitLabel = isCreateMode
    ? t("physicalInstance.creation.create")
    : t("physicalInstance.view.editModal.save");

  const cancelLabel = isCreateMode
    ? t("physicalInstance.creation.cancel")
    : t("physicalInstance.view.editModal.cancel");

  return (
    <Dialog
      header={dialogTitle}
      visible={visible}
      onHide={handleHide}
      className="ddi physical-instance-creation-dialog"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-column gap-3">
        <div className="flex flex-column gap-2">
          <label htmlFor="label">{t("physicalInstance.creation.label")}</label>
          <InputText
            id="label"
            name="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="group">{t("physicalInstance.creation.group")}</label>
          <Dropdown
            id="group"
            value={selectedGroupId}
            options={groupOptions}
            onChange={(e) => handleGroupChange(e.value)}
            placeholder={t("physicalInstance.creation.selectGroup")}
            loading={isLoadingGroups}
            className="w-full"
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="studyUnit">{t("physicalInstance.creation.studyUnit")}</label>
          <Dropdown
            id="studyUnit"
            value={selectedStudyUnitId}
            options={studyUnitOptions}
            onChange={(e) => setSelectedStudyUnitId(e.value)}
            placeholder={t("physicalInstance.creation.selectStudyUnit")}
            disabled={!selectedGroupId}
            loading={isLoadingStudyUnits}
            className="w-full"
          />
        </div>

        <div className="dialog-footer">
          <Button
            label={cancelLabel}
            type="button"
            outlined
            onClick={handleHide}
            disabled={isSubmitting}
          />
          <Button
            label={submitLabel}
            type="submit"
            className="create-button"
            disabled={isSubmitting || !isFormValid}
            loading={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
};
