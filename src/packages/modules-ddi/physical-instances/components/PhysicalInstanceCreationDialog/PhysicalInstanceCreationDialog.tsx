import { FormEvent, useRef, useState, useMemo, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useGroups } from "../../../hooks/useGroups";
import { useGroupDetails } from "../../../hooks/useGroupDetails";
import { buildDataRelationshipLabel, buildLogicalRecordLabel } from "../../constants";
import { pickLang } from "../../../utils/multilingual";
import "./PhysicalInstanceCreationDialog.css";

export interface SelectedGroup {
  id: string;
  agency: string;
}

export interface SelectedStudyUnit {
  id: string;
  agency: string;
}

export interface PhysicalInstanceCreationData {
  label: string;
  dataRelationshipLabel: string;
  logicalRecordLabel: string;
  group: SelectedGroup;
  studyUnit: SelectedStudyUnit;
}

export interface PhysicalInstanceUpdateData {
  label: string;
  dataRelationshipLabel: string;
  logicalRecordLabel: string;
  group: SelectedGroup;
  studyUnit: SelectedStudyUnit;
}

interface PhysicalInstanceDialogProps {
  visible: boolean;
  onHide: () => void;
  mode: "create" | "edit" | "duplicate";
  initialData?: { label: string; group?: SelectedGroup; studyUnit?: SelectedStudyUnit };
  onSubmitCreate?: (data: PhysicalInstanceCreationData) => Promise<void>;
  onSubmitEdit?: (data: PhysicalInstanceUpdateData) => Promise<void>;
  onSubmitDuplicate?: (data: PhysicalInstanceCreationData) => Promise<void>;
}

export const PhysicalInstanceDialog = ({
  visible,
  onHide,
  mode,
  initialData,
  onSubmitCreate,
  onSubmitEdit,
  onSubmitDuplicate,
}: Readonly<PhysicalInstanceDialogProps>) => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedStudyUnitId, setSelectedStudyUnitId] = useState<string | null>(null);
  const [label, setLabel] = useState("");

  // Le Groupe n'est modifiable qu'à la création ; en édition comme en duplication
  // il est verrouillé (la PI reste rattachée à son groupe).
  const groupDisabled = mode !== "create";
  // La SU est modifiable à la création ET à la duplication ; seule l'édition la fige.
  const suDisabled = mode === "edit";

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
      label: pickLang(su.Citation.Title, "fr-FR") ?? "",
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
      if (initialData.group) setSelectedGroupId(initialData.group.id);
      if (initialData.studyUnit) setSelectedStudyUnitId(initialData.studyUnit.id);
    }
  }, [visible, initialData]);

  // Le focus initial est posé via le callback onShow de la Dialog (cf. plus bas)
  // plutôt qu'avec un setTimeout : PrimeReact, en fin d'animation d'ouverture,
  // appelle onShow() PUIS, si rien n'est focalisé dans la modale, pose le focus
  // sur la croix de fermeture. En focalisant l'input dans onShow on précède ce
  // repli de manière déterministe (sinon course de timing → focus aléatoire sur
  // la croix selon la machine).
  const handleShow = () => labelInputRef.current?.focus();

  const handleGroupChange = (value: string | null) => {
    setSelectedGroupId(value);
    setSelectedStudyUnitId(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const data: PhysicalInstanceCreationData = {
        label: label,
        dataRelationshipLabel: buildDataRelationshipLabel(label),
        logicalRecordLabel: buildLogicalRecordLabel(label),
        group: selectedGroup!,
        studyUnit: selectedStudyUnit!,
      };
      if (mode === "create") {
        // Ne pas appeler resetForm() ici car la redirection va démonter le composant
        // et on évite ainsi de voir le formulaire vide pendant un court instant
        await onSubmitCreate?.(data);
      } else if (mode === "duplicate") {
        await onSubmitDuplicate?.(data);
      } else {
        await onSubmitEdit?.(data);
      }
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

  const titleKeyByMode = {
    create: "physicalInstance.creation.title",
    edit: "physicalInstance.view.editModal.title",
    duplicate: "physicalInstance.view.duplicateModal.title",
  } as const;
  const submitKeyByMode = {
    create: "physicalInstance.creation.create",
    edit: "physicalInstance.view.editModal.save",
    duplicate: "physicalInstance.view.duplicateModal.confirm",
  } as const;
  const cancelKeyByMode = {
    create: "physicalInstance.creation.cancel",
    edit: "physicalInstance.view.editModal.cancel",
    duplicate: "physicalInstance.view.duplicateModal.cancel",
  } as const;

  const dialogTitle = t(titleKeyByMode[mode]);
  const submitLabel = t(submitKeyByMode[mode]);
  const cancelLabel = t(cancelKeyByMode[mode]);

  return (
    <Dialog
      header={dialogTitle}
      visible={visible}
      onHide={handleHide}
      onShow={handleShow}
      blockScroll
      className="ddi physical-instance-creation-dialog"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-column gap-3">
        <div className="flex flex-column gap-2">
          <label htmlFor="physicalInstanceLabel">{t("physicalInstance.creation.label")}</label>
          <InputText
            ref={labelInputRef}
            id="physicalInstanceLabel"
            name="physicalInstanceLabel"
            autoComplete="off"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={isSubmitting}
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
            disabled={groupDisabled || isSubmitting}
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
            disabled={suDisabled || !selectedGroupId || isSubmitting}
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
