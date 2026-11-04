import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Button } from "@components/buttons/button";
import { AbstractButton, FilePlusIcon } from "@components/buttons/buttons-with-icons";
import { ErrorBloc } from "@components/errors-bloc";
import { Button as UiButton } from "@components/ui/button";
import { Dialog } from "@components/ui/dialog";
import { InputText } from "@components/ui/input-text";

import { DDIApi } from "@sdk/ddi-api";

import { usePrivileges } from "@utils/hooks/users";

import { useVisibleModules } from "../../../../../application/visible-modules";
import {
  buildDataRelationshipLabel,
  buildLogicalRecordLabel,
} from "../../../../../modules-ddi/physical-instances/constants";

interface ParentRef {
  agency: string;
  id: string;
  label: string | null;
}

/** Ligne de `GET /ddi/operation/{id}/study-units`. */
interface OperationStudyUnit {
  studyUnit: ParentRef;
  group: ParentRef;
}

interface TopLevelReference {
  $type: string;
  Agency?: string;
  ID: string;
}

/**
 * Le droit de création ne dépend pas encore d'une ressource : le bouton s'affiche dès que la
 * stratégie n'est pas NONE, le back vérifiant ensuite le stamp sur le groupe (série) cible.
 */
const useCanCreatePhysicalInstance = () => {
  const { privileges } = usePrivileges();
  const strategy = privileges
    ?.find((p) => p.application === "DDI_PHYSICALINSTANCE")
    ?.privileges.find((p) => p.privilege === "CREATE")?.strategy;
  return !!strategy && strategy !== "NONE";
};

const labelOf = (ref: ParentRef) => ref.label ?? ref.id;

/**
 * Bouton « Nouveau fichier de données » de la fiche d'une opération : le fichier est rangé dans
 * l'étude DDI miroir de l'opération, sous le groupe miroir de sa série. Absent tant que l'opération
 * n'a pas d'étude DDI (rien où ranger le fichier).
 */
export const CreateOperationPhysicalInstance = ({
  operationId,
}: Readonly<{ operationId: string }>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ddiOpen = useVisibleModules().includes("ddi");
  const canCreate = useCanCreatePhysicalInstance();

  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [chosenStudyUnitId, setChosenStudyUnitId] = useState<string>();

  const { data: studyUnits = [] } = useQuery<OperationStudyUnit[]>({
    queryKey: ["operationStudyUnits", operationId],
    queryFn: () => DDIApi.getOperationStudyUnits(operationId),
    enabled: ddiOpen && canCreate,
    retry: false,
  });

  const target =
    studyUnits.length === 1
      ? studyUnits[0]
      : studyUnits.find((su) => su.studyUnit.id === chosenStudyUnitId);

  const creation = useMutation({
    meta: { globalErrorToast: false },
    mutationFn: async ({ studyUnit, group }: OperationStudyUnit) => {
      const response: { topLevelReferences?: TopLevelReference[] } =
        await DDIApi.postPhysicalInstance({
          physicalInstanceLabel: label,
          dataRelationshipLabel: buildDataRelationshipLabel(label),
          logicalRecordLabel: buildLogicalRecordLabel(label),
          groupId: group.id,
          groupAgency: group.agency,
          studyUnitId: studyUnit.id,
          studyUnitAgency: studyUnit.agency,
        });
      const reference = response.topLevelReferences?.find(
        (ref) => ref.$type === "PhysicalInstance",
      );
      if (!reference) {
        throw new Error("Physical Instance reference not found in response");
      }
      return { id: reference.ID, agency: reference.Agency ?? studyUnit.agency };
    },
    onSuccess: ({ agency, id }) => {
      void queryClient.invalidateQueries({ queryKey: ["operationPhysicalInstances", operationId] });
      void queryClient.invalidateQueries({ queryKey: ["physicalInstances"] });
      void navigate(`/ddi/physical-instances/${agency}/${id}`);
    },
  });

  if (studyUnits.length === 0) return null;

  const close = () => {
    if (creation.isPending) return;
    setVisible(false);
    setLabel("");
    setChosenStudyUnitId(undefined);
    creation.reset();
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (target && label.trim()) creation.mutate(target);
  };

  return (
    <>
      <AbstractButton
        icon={<FilePlusIcon />}
        classes={["bauhaus-btn-outline"]}
        action={() => setVisible(true)}
        label={t("operationPhysicalInstance.new")}
      />
      <Dialog
        header={t("operationPhysicalInstance.title")}
        visible={visible}
        onHide={close}
        blockScroll
      >
        <form onSubmit={submit} className="flex flex-column gap-3">
          <ErrorBloc error={creation.error ?? undefined} />
          <div className="flex flex-column gap-2">
            <label htmlFor="operationPhysicalInstanceLabel">
              {t("operationPhysicalInstance.label")}
            </label>
            <InputText
              id="operationPhysicalInstanceLabel"
              autoComplete="off"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={creation.isPending}
            />
          </div>
          {studyUnits.length > 1 && (
            <fieldset className="flex flex-column gap-2">
              <legend>{t("operationPhysicalInstance.studyUnit")}</legend>
              {studyUnits.map(({ studyUnit }) => (
                <label key={`${studyUnit.agency}/${studyUnit.id}`} className="flex gap-2">
                  <input
                    type="radio"
                    name="operationPhysicalInstanceStudyUnit"
                    value={studyUnit.id}
                    checked={chosenStudyUnitId === studyUnit.id}
                    onChange={() => setChosenStudyUnitId(studyUnit.id)}
                    disabled={creation.isPending}
                  />
                  {labelOf(studyUnit)}
                </label>
              ))}
            </fieldset>
          )}
          <div className="flex justify-content-end gap-2">
            <Button
              action={close}
              label={t("operationPhysicalInstance.cancel")}
              disabled={creation.isPending}
            />
            <UiButton
              type="submit"
              className="bauhaus-btn"
              label={t("operationPhysicalInstance.create")}
              disabled={creation.isPending || !target || !label.trim()}
              loading={creation.isPending}
              aria-busy={creation.isPending}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};
