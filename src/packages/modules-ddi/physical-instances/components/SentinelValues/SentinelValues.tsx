import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type {
  Category,
  CodeList,
  ManagedMissingValuesRepresentation,
  Reference,
} from "../../types/api";
import { CodeListDataTable, CodeTableRow } from "../CodeRepresentation/CodeListDataTable";
import { UsersPanel } from "../CodeRepresentation/UsersPanel";
import {
  createCategory,
  createCode,
  createDefaultCodeList,
  createDefaultRepresentation,
  createLabel,
  getLocalizedText,
} from "../CodeRepresentation/CodeRepresentation.utils";
import { useAppContext } from "../../../../application/app-context";
import { useDefaultLocale } from "../../../hooks/useDefaultLocale";
import { useAllMissingValuesRepresentations } from "../../../hooks/useAllMissingValuesRepresentations";
import { useDeleteMmvr } from "../../../hooks/useDeleteMmvr";
import { useMutualizedCodesList } from "../../../hooks/useMutualizedCodesList";
import { useMmvrUsers } from "../../../hooks/useMmvrUsers";

export interface SentinelValuesProps {
  missingValuesReference?: Reference;
  /** MMVR matérialisée localement (modifications en attente de sauvegarde). */
  mmvr?: ManagedMissingValuesRepresentation;
  sentinelCodeList?: CodeList;
  sentinelCategories?: Category[];
  /** Variable en cours d'édition — exclue du décompte des usages de la MMVR. */
  currentVariableId?: string;
  /**
   * IDs des MMVR référencées par les AUTRES variables locales non sauvegardées : le back ne les
   * connaît pas encore, ce décompte local complète le sien pour verrouiller la liste.
   */
  locallyUsedMmvrIds?: string[];
  onChange: (
    missingValuesReference: Reference | undefined,
    mmvr?: ManagedMissingValuesRepresentation,
    sentinelCodeList?: CodeList,
    sentinelCategories?: Category[],
  ) => void;
}

const mmvrReference = (agency: string, id: string, version: string): Reference => ({
  $type: "ManagedMissingValuesRepresentation",
  URN: `urn:ddi:${agency}:${id}:${version}`,
  Agency: agency,
  ID: id,
  Version: version,
});

const buildMmvr = (
  id: string,
  agency: string,
  version: string,
  label: string,
  locale: string,
  sentinelCodeListId: string,
): ManagedMissingValuesRepresentation => ({
  $type: "ManagedMissingValuesRepresentation",
  VersionDate: { DateTime: new Date().toISOString() },
  URN: `urn:ddi:${agency}:${id}:${version}`,
  Agency: agency,
  ID: id,
  Version: version,
  Label: createLabel(label, locale),
  MissingCodeRepresentation: [createDefaultRepresentation(sentinelCodeListId, agency)],
});

/**
 * Section « Valeurs sentinelles » (#1566) de l'onglet représentation, disponible pour les quatre
 * types. Poser une valeur sentinelle = sélectionner une MMVR existante du groupe de la PI ; sa
 * CodeList de sentinelles s'affiche alors :
 * - en lecture-écriture quand la variable ouverte est la SEULE à référencer la MMVR (usages
 *   résolus côté back) — les modifications sont matérialisées sous les mêmes IDs, pas de fork ;
 * - en lecture seule dès qu'au moins une autre variable la référence.
 */
export const SentinelValues = ({
  missingValuesReference,
  mmvr,
  sentinelCodeList,
  sentinelCategories = [],
  currentVariableId,
  locallyUsedMmvrIds = [],
  onChange,
}: Readonly<SentinelValuesProps>) => {
  const { t } = useTranslation();
  const { properties } = useAppContext();
  const defaultAgencyId = properties.defaultAgencyId;
  const defaultLocale = useDefaultLocale();
  const { id: physicalInstanceId = "", agencyId = "" } = useParams<{
    id: string;
    agencyId: string;
  }>();
  const {
    data: reusableMmvrs = [],
    isLoading,
    error,
  } = useAllMissingValuesRepresentations(agencyId, physicalInstanceId);

  // Dépliée d'office quand une sentinelle est déjà posée.
  const [activeIndex, setActiveIndex] = useState<number | null>(missingValuesReference ? 0 : null);

  const selectedMmvr = missingValuesReference
    ? reusableMmvrs.find(
        (item) =>
          item.agency === missingValuesReference.Agency && item.id === missingValuesReference.ID,
      )
    : undefined;

  // Modifications locales en attente ⇔ la MMVR matérialisée accompagne la référence.
  const hasLocalEdits = Boolean(missingValuesReference && mmvr);

  // Usages de la MMVR (variables qui la référencent, résolus côté back) : la CodeList n'est
  // éditable que si la variable ouverte est la seule utilisatrice. Inutile quand des
  // modifications locales portent déjà la MMVR (créée/modifiée localement). Le décompte back
  // est complété par les références des autres variables locales non sauvegardées.
  const { data: mmvrUsers = [], isLoading: isLoadingUsers } = useMmvrUsers(
    missingValuesReference?.Agency ?? "",
    missingValuesReference?.ID ?? "",
    Boolean(missingValuesReference) && !hasLocalEdits,
  );
  const sharedWithOthers =
    mmvrUsers.some((user) => user.variableId !== currentVariableId) ||
    Boolean(missingValuesReference && locallyUsedMmvrIds.includes(missingValuesReference.ID));

  const deleteMmvr = useDeleteMmvr();
  // MMVR orpheline (aucun usage sauvegardé, pas de référence d'une autre variable locale) : on
  // propose sa suppression du groupe — le back re-vérifie et refuse (409) en cas de course.
  const isOrphan =
    Boolean(missingValuesReference) &&
    !hasLocalEdits &&
    !isLoadingUsers &&
    mmvrUsers.length === 0 &&
    !locallyUsedMmvrIds.includes(missingValuesReference?.ID ?? "");
  const isEditable = hasLocalEdits || (Boolean(missingValuesReference) && !sharedWithOthers);

  // Contenu de la CodeList de sentinelles (endpoint générique). Inutile quand les modifications
  // locales portent déjà la liste.
  const { data: codeListContent, isLoading: isLoadingCodes } = useMutualizedCodesList(
    !hasLocalEdits ? (selectedMmvr?.agency ?? "") : "",
    !hasLocalEdits ? (selectedMmvr?.codeListId ?? "") : "",
  );
  const loadedCodeList = codeListContent?.CodeList?.[0];
  const loadedCategoryLabelById = new Map(
    (codeListContent?.Category ?? []).map((cat) => [cat.ID, getLocalizedText(cat.Label) ?? ""]),
  );
  const loadedRows: CodeTableRow[] = (loadedCodeList?.Code ?? []).map((code) => ({
    id: code.ID,
    value: code.Value?.StringValue ?? "",
    label: loadedCategoryLabelById.get(code.CategoryReference?.ID) ?? "",
    categoryId: code.CategoryReference?.ID ?? "",
  }));

  // État local du mode éditable (source de vérité pendant l'édition, comme le reducer de
  // CodeRepresentation) : le libellé et les lignes ne dépendent jamais des props remontées par le
  // parent au tour précédent — une fermeture périmée (chaîne DataTable) écraserait sinon le
  // libellé fraîchement saisi. Initialisé depuis les props au montage (modifications locales
  // rouvertes), ou depuis le contenu chargé (matérialisation, effet ci-dessous).
  const initialRows = (): CodeTableRow[] =>
    (sentinelCodeList?.Code ?? []).map((code) => {
      const category = sentinelCategories.find((cat) => cat.ID === code.CategoryReference?.ID);
      return {
        id: code.ID,
        value: code.Value?.StringValue ?? "",
        label: getLocalizedText(category?.Label) ?? "",
        categoryId: category?.ID ?? code.CategoryReference?.ID ?? "",
      };
    });
  const [editLabel, setEditLabel] = useState(() => getLocalizedText(mmvr?.Label) ?? "");
  const [editRows, setEditRows] = useState<CodeTableRow[]>(initialRows);
  const editIdsRef = useRef({
    mmvrId: mmvr?.ID,
    codeListId: sentinelCodeList?.ID,
  });

  // Matérialisation : au chargement du contenu en mode éditable, l'état local reprend la CodeList
  // sous ses PROPRES IDs (MMVR de la référence, CodeList chargée) — la première édition réémettra
  // les items modifiés en place, pas de fork.
  const materializationKey =
    isEditable && !hasLocalEdits && !isLoadingUsers ? loadedCodeList?.ID : undefined;
  useEffect(() => {
    if (!materializationKey || !loadedCodeList) return;
    editIdsRef.current = {
      mmvrId: missingValuesReference?.ID,
      codeListId: loadedCodeList.ID,
    };
    setEditLabel(getLocalizedText(loadedCodeList.Label) ?? selectedMmvr?.label ?? "");
    setEditRows(loadedRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materializationKey]);

  const emitEdit = (label: string, rows: CodeTableRow[]) => {
    const agency = missingValuesReference?.Agency ?? agencyId;
    const version = missingValuesReference?.Version ?? "1";
    const codeListId = editIdsRef.current.codeListId ?? crypto.randomUUID();
    const mmvrId = editIdsRef.current.mmvrId ?? missingValuesReference?.ID ?? crypto.randomUUID();
    editIdsRef.current = { mmvrId, codeListId };

    const newCategories = rows.map((row) =>
      createCategory(row.categoryId, row.label, agency, defaultLocale),
    );
    const newCodes = rows.map((row) => createCode(row.id, row.categoryId, row.value, agency));
    const newCodeList: CodeList = {
      ...createDefaultCodeList(codeListId, label, agency, defaultLocale),
      Code: newCodes,
    };

    onChange(
      mmvrReference(agency, mmvrId, version),
      buildMmvr(mmvrId, agency, version, label, defaultLocale, codeListId),
      newCodeList,
      newCategories,
    );
  };

  // Création à la volée d'une MMVR et de sa CodeList de sentinelles (nouveaux IDs) : la variable
  // en est la seule utilisatrice, la table est donc éditable (hasLocalEdits) dès l'émission.
  const handleCreateNewList = () => {
    const newRow: CodeTableRow = {
      id: crypto.randomUUID(),
      value: "",
      label: "",
      categoryId: crypto.randomUUID(),
      isNew: true,
    };
    const mmvrId = crypto.randomUUID();
    const codeListId = crypto.randomUUID();
    editIdsRef.current = { mmvrId, codeListId };
    setEditLabel("");
    setEditRows([newRow]);

    const newCodeList: CodeList = {
      ...createDefaultCodeList(codeListId, "", defaultAgencyId, defaultLocale),
      Code: [createCode(newRow.id, newRow.categoryId, newRow.value, defaultAgencyId)],
    };
    onChange(
      mmvrReference(defaultAgencyId, mmvrId, "1"),
      buildMmvr(mmvrId, defaultAgencyId, "1", "", defaultLocale, codeListId),
      newCodeList,
      [createCategory(newRow.categoryId, newRow.label, defaultAgencyId, defaultLocale)],
    );
  };

  // Garde-fou : changer de sélection ou retirer alors que des modifications locales sont en
  // cours les jetterait silencieusement — on demande confirmation d'abord.
  const withDiscardGuard = (apply: () => void) => {
    if (!hasLocalEdits) {
      apply();
      return;
    }
    confirmDialog({
      header: t("physicalInstance.view.sentinel.discardEdits.title"),
      message: t("physicalInstance.view.sentinel.discardEdits.message"),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: t("physicalInstance.view.sentinel.discardEdits.confirm"),
      rejectLabel: t("physicalInstance.view.sentinel.discardEdits.cancel"),
      acceptClassName: "p-button-warning",
      accept: apply,
    });
  };

  const handleSelect = (value: string) => {
    const selected = reusableMmvrs.find((item) => `${item.agency}-${item.id}` === value);
    if (!selected) return;
    withDiscardGuard(() => {
      editIdsRef.current = { mmvrId: undefined, codeListId: undefined };
      onChange(
        mmvrReference(selected.agency, selected.id, selected.version),
        undefined,
        undefined,
        undefined,
      );
    });
  };

  const handleRemove = () => {
    withDiscardGuard(() => {
      editIdsRef.current = { mmvrId: undefined, codeListId: undefined };
      setEditLabel("");
      setEditRows([]);
      onChange(undefined, undefined, undefined, undefined);
    });
  };

  const handleDeleteFromGroup = () => {
    const reference = missingValuesReference;
    if (!reference?.Agency || !reference.ID) return;
    confirmDialog({
      header: t("physicalInstance.view.sentinel.deleteConfirm.title"),
      message: t("physicalInstance.view.sentinel.deleteConfirm.message"),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: t("physicalInstance.view.sentinel.deleteConfirm.confirm"),
      rejectLabel: t("physicalInstance.view.sentinel.deleteConfirm.cancel"),
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteMmvr.mutate(
          { agencyId: reference.Agency, id: reference.ID },
          {
            onSuccess: () => {
              // La MMVR n'existe plus : la variable ne peut plus la référencer.
              onChange(undefined, undefined, undefined, undefined);
            },
          },
        );
      },
    });
  };

  const handleLabelChange = (label: string) => {
    setEditLabel(label);
    emitEdit(label, editRows);
  };

  const handleCellEdit = (rowData: CodeTableRow, field: "value" | "label", newValue: string) => {
    const rows = editRows.map((row) =>
      row.id === rowData.id ? { ...row, [field]: newValue } : row,
    );
    setEditRows(rows);
    emitEdit(editLabel, rows);
  };

  const handleAddCode = (value: string, label: string) => {
    const rows = [
      ...editRows,
      { id: crypto.randomUUID(), value, label, categoryId: crypto.randomUUID(), isNew: true },
    ];
    setEditRows(rows);
    emitEdit(editLabel, rows);
  };

  const handleDeleteCode = (codeId: string) => {
    const rows = editRows.filter((row) => row.id !== codeId);
    setEditRows(rows);
    emitEdit(editLabel, rows);
  };

  const selectOptions = reusableMmvrs.map((item) => ({
    value: `${item.agency}-${item.id}`,
    label: item.codeValues.length
      ? `${item.label ?? item.id} (${item.codeValues.join(", ")})`
      : (item.label ?? item.id),
  }));

  // Chargement progressif : la table s'affiche verrouillée dès que le contenu de la liste est
  // chargé, même si les usages sont encore en cours de résolution — elle n'est déverrouillée que
  // quand ceux-ci confirment que la variable est la seule utilisatrice.
  const showEditableTable =
    hasLocalEdits ||
    (Boolean(missingValuesReference) && isEditable && !isLoadingUsers && Boolean(loadedCodeList));
  const showReadOnlyTable =
    Boolean(missingValuesReference) &&
    !showEditableTable &&
    !hasLocalEdits &&
    Boolean(loadedCodeList);

  return (
    <Accordion
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index as number | null)}
    >
      <AccordionTab header={t("physicalInstance.view.sentinel.title")}>
        <div className="flex flex-column gap-2">
          {isLoading && (
            <div className="flex gap-2 align-items-center">
              <ProgressSpinner
                style={{ width: "20px", height: "20px", margin: "0" }}
                strokeWidth="4"
              />
              <span>{t("physicalInstance.view.sentinel.loading")}</span>
            </div>
          )}

          {Boolean(error) && (
            <Message severity="error" text={t("physicalInstance.view.sentinel.errorLoading")} />
          )}

          {!isLoading && (
            <div className="flex gap-2 align-items-center">
              <Dropdown
                filter
                value={
                  missingValuesReference
                    ? `${missingValuesReference.Agency}-${missingValuesReference.ID}`
                    : null
                }
                options={selectOptions}
                onChange={(e) => handleSelect(e.value)}
                placeholder={t("physicalInstance.view.sentinel.select")}
                className="w-full"
              />
              <Button
                type="button"
                icon="pi pi-plus"
                label={t("physicalInstance.view.sentinel.createNewList")}
                outlined
                onClick={handleCreateNewList}
              />
              {missingValuesReference && (
                <Button
                  type="button"
                  icon="pi pi-times"
                  label={t("physicalInstance.view.sentinel.remove")}
                  outlined
                  severity="danger"
                  onClick={handleRemove}
                />
              )}
              {isOrphan && (
                <Button
                  type="button"
                  icon="pi pi-trash"
                  label={t("physicalInstance.view.sentinel.deleteFromGroup")}
                  outlined
                  severity="danger"
                  loading={deleteMmvr.isPending}
                  onClick={handleDeleteFromGroup}
                />
              )}
            </div>
          )}

          {Boolean(missingValuesReference) && isLoadingCodes && !hasLocalEdits && (
            <div className="flex gap-2 align-items-center">
              <ProgressSpinner
                style={{ width: "20px", height: "20px", margin: "0" }}
                strokeWidth="4"
              />
              <span>{t("physicalInstance.view.code.loadingCodes")}</span>
            </div>
          )}

          {showReadOnlyTable && loadedCodeList && (
            <CodeListDataTable
              codeListLabel={getLocalizedText(loadedCodeList.Label) ?? selectedMmvr?.label ?? ""}
              codes={loadedRows}
              onCodeListLabelChange={() => {}}
              onCellEdit={() => {}}
              onDeleteCode={() => {}}
              onAddCode={() => {}}
              readOnly
            />
          )}

          {showEditableTable && (
            <CodeListDataTable
              codeListLabel={editLabel}
              codes={editRows}
              onCodeListLabelChange={handleLabelChange}
              onCellEdit={handleCellEdit}
              onDeleteCode={handleDeleteCode}
              onAddCode={handleAddCode}
            />
          )}

          {/* Pourquoi la liste est verrouillée : les autres variables qui réutilisent la MMVR. */}
          {missingValuesReference && !hasLocalEdits && (
            <UsersPanel
              usages={mmvrUsers}
              currentVariableId={currentVariableId}
              title={t("physicalInstance.view.sentinel.usersPanel.title")}
              help={t("physicalInstance.view.sentinel.usersPanel.help")}
              tooltipTargetId={`mmvr-users-help-${missingValuesReference.Agency}-${missingValuesReference.ID}`}
            />
          )}
        </div>
      </AccordionTab>
    </Accordion>
  );
};
