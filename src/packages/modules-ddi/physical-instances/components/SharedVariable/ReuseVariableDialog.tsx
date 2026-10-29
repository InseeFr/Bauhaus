import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@components/ui/button";
import { Dialog } from "@components/ui/dialog";
import { Dropdown } from "@components/ui/dropdown";

import { useStudyUnitVariables } from "../../../hooks/useStudyUnitVariables";
import { pickLang } from "../../../utils/multilingual";
import type { Variable } from "../../types/api";

const LANG = "fr-FR";

// Même rendu que les boutons d'action de la page (Sauvegarder, Ajouter une variable…).
const TRANSPARENT = { background: "transparent" } as const;

interface ReuseVariableDialogProps {
  /** StudyUnit de la PhysicalInstance : son VariableScheme est le vivier de la recherche. */
  studyUnit: { agency: string; id: string };
  /** Variables déjà présentes dans la PhysicalInstance, qu'il serait vain de proposer. */
  excludedVariableIds: string[];
  /** Reçoit l'item Variable choisi, tel que stocké (mêmes Agency, ID et Version). */
  onReuse: (variable: Variable) => void;
  onHide: () => void;
}

const variableKey = (variable: Variable) => `${variable.Agency}/${variable.ID}`;

/**
 * Recherche d'une variable à réutiliser dans le VariableScheme de la StudyUnit (#1387). La
 * variable réutilisée n'est pas copiée : c'est la même, partagée avec les fichiers qui l'utilisent
 * déjà. Monté à l'ouverture seulement, pour ne descendre l'arborescence Colectica qu'à la demande.
 */
export const ReuseVariableDialog = ({
  studyUnit,
  excludedVariableIds,
  onReuse,
  onHide,
}: Readonly<ReuseVariableDialogProps>) => {
  const { t } = useTranslation();
  const { data: variables = [], isLoading } = useStudyUnitVariables(studyUnit.agency, studyUnit.id);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const reusableVariables = useMemo(
    () => variables.filter((variable) => !excludedVariableIds.includes(variable.ID)),
    [variables, excludedVariableIds],
  );

  const options = useMemo(
    () =>
      reusableVariables
        .map((variable) => ({
          label: `${pickLang(variable.VariableName, LANG) ?? variable.ID} — ${pickLang(variable.Label, LANG) ?? ""}`,
          value: variableKey(variable),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [reusableVariables],
  );

  const selectedVariable = reusableVariables.find(
    (variable) => variableKey(variable) === selectedKey,
  );

  const actions = (
    <div className="flex justify-content-end gap-2 mt-3">
      <Button
        label={t("physicalInstance.view.reuseVariable.cancel")}
        icon="pi pi-times"
        severity="secondary"
        style={TRANSPARENT}
        onClick={onHide}
      />
      <Button
        label={t("physicalInstance.view.reuseVariable.confirm")}
        icon="pi pi-check"
        severity="secondary"
        style={TRANSPARENT}
        disabled={!selectedVariable}
        onClick={() => selectedVariable && onReuse(selectedVariable)}
      />
    </div>
  );

  return (
    <Dialog
      visible
      onHide={onHide}
      header={t("physicalInstance.view.reuseVariable.title")}
      style={{ width: "40rem", maxWidth: "95vw" }}
      // Sans cela, le scroll du fond décroche le panneau de la liste déroulante.
      blockScroll
    >
      <p className="mt-0">{t("physicalInstance.view.reuseVariable.help")}</p>
      <Dropdown
        value={selectedKey}
        options={options}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => setSelectedKey(e.value)}
        filter
        filterBy="label"
        loading={isLoading}
        placeholder={t("physicalInstance.view.reuseVariable.select")}
        emptyMessage={t("physicalInstance.view.reuseVariable.empty")}
        aria-label={t("physicalInstance.view.reuseVariable.select")}
        className="w-full"
      />
      {actions}
    </Dialog>
  );
};
