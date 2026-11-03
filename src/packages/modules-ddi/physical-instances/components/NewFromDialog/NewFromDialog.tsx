import { useQueryClient } from "@tanstack/react-query";
import { SubmitEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";
import { Button } from "@components/ui/button";
import { Dialog } from "@components/ui/dialog";
import { InputText } from "@components/ui/input-text";

import { Option } from "@model/SelectOption";

import { formatApiErrors } from "@utils/api-errors";
import { filterKeyDeburr, nbResults } from "@utils/array-utils";

import { componentsI18n } from "../../../../components/i18n";
import { appI18n } from "../../../../i18n";
import {
  physicalInstanceQuery,
  usePhysicalInstancesData,
} from "../../../hooks/usePhysicalInstance";
import {
  physicalInstanceParentsQuery,
  usePhysicalInstanceParents,
} from "../../../hooks/usePhysicalInstanceParents";
import {
  PhysicalInstanceSearchRow,
  usePhysicalInstancesSearch,
} from "../../../hooks/usePhysicalInstancesSearch";
import { useReuseVariables } from "../../../hooks/useReuseVariables";
import { formatDate } from "../../../utils/formatDate";
import { buildDataRelationshipLabel, buildLogicalRecordLabel } from "../../constants";
import "./NewFromDialog.css";

const filterLabel = filterKeyDeburr(["label"]);

interface SourceInstance {
  agency: string;
  id: string;
  label: string;
}

type Step = "source" | "workflow" | "reuseVariables";

const sourceKey = (source: { agency: string; id: string }) => `${source.agency}|${source.id}`;

/** Options distinctes (par id) d'une clé id/libellé des lignes de recherche, triées par libellé. */
const buildOptions = (
  rows: PhysicalInstanceSearchRow[],
  idKey: "studyUnitId" | "groupId",
  labelKey: "studyUnitLabel" | "groupLabel",
): Option[] => {
  const byId = new Map<string, string>();
  for (const row of rows) {
    const id = row[idKey];
    if (id && !byId.has(id)) {
      byId.set(id, row[labelKey] ?? id);
    }
  }
  return [...byId.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

interface NewFromDialogProps {
  visible: boolean;
  onHide: () => void;
}

/**
 * « Nouveau à partir de… » (#1652) : choix d'un fichier source, puis du parcours de création.
 * Seul le parcours « Réutiliser des variables » (#1674) est proposé.
 */
export const NewFromDialog = ({ visible, onHide }: Readonly<NewFromDialogProps>) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("source");
  const [source, setSource] = useState<SourceInstance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // La lecture de la source (variables) est lourde : elle part dès que le fichier est coché, pour
  // être prête, ou bien avancée, quand l'utilisateur arrive au choix des variables.
  const selectSource = (selected: SourceInstance) => {
    setSource(selected);
    void queryClient.prefetchQuery(physicalInstanceQuery(selected.agency, selected.id));
    void queryClient.prefetchQuery(physicalInstanceParentsQuery(selected.agency, selected.id));
  };

  const handleHide = () => {
    if (isSubmitting) return;
    setStep("source");
    setSource(null);
    onHide();
  };

  return (
    <Dialog
      header={t("physicalInstance.newFrom.title")}
      visible={visible}
      onHide={handleHide}
      blockScroll
      className="ddi new-from-dialog"
    >
      {step === "source" && (
        <SourceStep
          selected={source}
          onSelect={selectSource}
          onCancel={handleHide}
          onNext={() => setStep("workflow")}
        />
      )}
      {step === "workflow" && source && (
        <WorkflowStep
          source={source}
          onBack={() => setStep("source")}
          onReuseVariables={() => setStep("reuseVariables")}
        />
      )}
      {step === "reuseVariables" && source && (
        <ReuseVariablesStep
          source={source}
          onBack={() => setStep("workflow")}
          onSubmittingChange={setIsSubmitting}
        />
      )}
    </Dialog>
  );
};

interface SourceStepProps {
  selected: SourceInstance | null;
  onSelect: (source: SourceInstance) => void;
  onCancel: () => void;
  onNext: () => void;
}

const SourceStep = ({ selected, onSelect, onCancel, onNext }: Readonly<SourceStepProps>) => {
  const { t } = useTranslation();
  // Compteur de résultats : mêmes libellés que la liste de l'accueil.
  const { t: tComponents } = useTranslation("translation", { i18n: componentsI18n });
  const { data = [], isLoading } = usePhysicalInstancesSearch();
  const [label, setLabel] = useState("");
  const [group, setGroup] = useState("");
  const [studyUnit, setStudyUnit] = useState("");

  const groupOptions = useMemo(() => buildOptions(data, "groupId", "groupLabel"), [data]);
  // Comme dans la recherche avancée : les opérations proposées sont celles de la série choisie.
  const studyUnitOptions = useMemo(
    () =>
      group
        ? buildOptions(
            data.filter((row) => row.groupId === group),
            "studyUnitId",
            "studyUnitLabel",
          )
        : [],
    [data, group],
  );

  // Une ligne par rattachement côté back : une PI réutilisée dans plusieurs études n'est
  // proposée qu'une fois. Une PI rattachée à aucune étude n'a nulle part où créer le nouveau
  // fichier : elle n'est pas proposée.
  const hits = useMemo(() => {
    const seen = new Set<string>();
    return data
      .filter((row) => !!row.studyUnitId)
      .filter(filterLabel(label))
      .filter((row) => !group || row.groupId === group)
      .filter((row) => !studyUnit || row.studyUnitId === studyUnit)
      .filter((row) => {
        const key = sourceKey(row);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [data, label, group, studyUnit]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-column gap-3">
      <div className="new-from-filters">
        <div className="flex flex-column gap-2">
          <label htmlFor="newFromLabel">{t("physicalInstance.search.labelFilter")}</label>
          <InputText
            id="newFromLabel"
            autoComplete="off"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t("physicalInstance.search.labelPlaceholder")}
          />
        </div>
        <div className="flex flex-column gap-2">
          <label htmlFor="newFromGroup">{t("physicalInstance.search.groupFilter")}</label>
          <Select
            inputId="newFromGroup"
            placeholder={t("physicalInstance.search.groupPlaceholder")}
            value={group || null}
            options={groupOptions}
            onChange={(value: string | null) => {
              setGroup(value ?? "");
              setStudyUnit("");
            }}
          />
        </div>
        <div className="flex flex-column gap-2">
          <label htmlFor="newFromStudyUnit">{t("physicalInstance.search.studyUnitFilter")}</label>
          <Select
            inputId="newFromStudyUnit"
            placeholder={t("physicalInstance.search.studyUnitPlaceholder")}
            value={studyUnit || null}
            options={studyUnitOptions}
            disabled={!group}
            onChange={(value: string | null) => setStudyUnit(value ?? "")}
          />
        </div>
      </div>

      <p className="new-from-count" aria-live="polite">
        {nbResults(hits, tComponents("results"), tComponents("result"))}
      </p>

      <ul className="new-from-list" aria-label={t("physicalInstance.newFrom.sourceList")}>
        {hits.map((row) => {
          const key = sourceKey(row);
          const inputId = `newFromSource-${key}`;
          const rowLabel = row.label ?? row.id;
          // Comme sur l'accueil : « libellé (JJ/MM/AAAA) ».
          const displayLabel = row.versionDate
            ? `${rowLabel} (${formatDate(row.versionDate)})`
            : rowLabel;
          const parentsLabel = [row.groupLabel, row.studyUnitLabel].filter(Boolean).join(" / ");
          return (
            <li key={key}>
              <input
                type="radio"
                id={inputId}
                name="newFromSource"
                aria-describedby={parentsLabel ? `${inputId}-parents` : undefined}
                checked={!!selected && sourceKey(selected) === key}
                onChange={() => onSelect({ agency: row.agency, id: row.id, label: rowLabel })}
              />
              <div className="new-from-source">
                <label htmlFor={inputId}>{displayLabel}</label>
                {parentsLabel && (
                  <span id={`${inputId}-parents`} className="new-from-parents">
                    {parentsLabel}
                  </span>
                )}
              </div>
              <a
                href={`/ddi/physical-instances/${row.agency}/${row.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("physicalInstance.newFrom.openInNewTab", { label: rowLabel })}
                title={t("physicalInstance.newFrom.openInNewTab", { label: rowLabel })}
              >
                <i className="pi pi-external-link" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>

      <div className="dialog-footer">
        <Button
          label={t("physicalInstance.creation.cancel")}
          type="button"
          outlined
          onClick={onCancel}
        />
        <Button
          label={t("physicalInstance.newFrom.next")}
          type="button"
          className="create-button"
          disabled={!selected}
          onClick={onNext}
        />
      </div>
    </div>
  );
};

interface WorkflowStepProps {
  source: SourceInstance;
  onBack: () => void;
  onReuseVariables: () => void;
}

const WorkflowStep = ({ source, onBack, onReuseVariables }: Readonly<WorkflowStepProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-column gap-3">
      <p>{t("physicalInstance.newFrom.selectedSource", { label: source.label })}</p>
      <button type="button" className="new-from-card" onClick={onReuseVariables}>
        <span className="new-from-card-title">
          {t("physicalInstance.newFrom.reuseVariables.title")}
        </span>
        <span>{t("physicalInstance.newFrom.reuseVariables.description")}</span>
      </button>
      <div className="dialog-footer">
        <Button
          label={t("physicalInstance.newFrom.back")}
          type="button"
          outlined
          onClick={onBack}
        />
      </div>
    </div>
  );
};

interface ReuseVariablesStepProps {
  source: SourceInstance;
  onBack: () => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
}

/**
 * Le nouveau fichier rejoint l'étude de la source (le back la retrouve lui-même) et partage les
 * variables cochées, toutes par défaut. La source a été préchargée dès qu'elle a été cochée.
 */
const ReuseVariablesStep = ({
  source,
  onBack,
  onSubmittingChange,
}: Readonly<ReuseVariablesStepProps>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    data: parents,
    isLoading: isLoadingParents,
    error: parentsError,
  } = usePhysicalInstanceParents(source.agency, source.id);
  const { variables, isLoading: isLoadingVariables } = usePhysicalInstancesData(
    source.agency,
    source.id,
  );
  const reuseVariables = useReuseVariables();
  const [label, setLabel] = useState("");
  // Variables décochées plutôt que cochées : toutes le sont par défaut, sans attendre le chargement.
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const selectedIds = variables.filter((v) => !excluded.has(v.id)).map((v) => v.id);
  const allSelected = variables.length > 0 && selectedIds.length === variables.length;
  const isFormValid = !!label.trim() && !!parents && selectedIds.length > 0;

  const toggle = (id: string) =>
    setExcluded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setExcluded(allSelected ? new Set(variables.map((v) => v.id)) : new Set());

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || !parents) return;

    setIsSubmitting(true);
    onSubmittingChange(true);
    setErrors([]);
    try {
      const created = await reuseVariables.mutateAsync({
        agencyId: source.agency,
        id: source.id,
        data: {
          physicalInstanceLabel: label,
          dataRelationshipLabel: buildDataRelationshipLabel(label),
          logicalRecordLabel: buildLogicalRecordLabel(label),
          groupId: parents.group.id,
          groupAgency: parents.group.agency,
          variableIds: selectedIds,
        },
      });
      void navigate(`/ddi/physical-instances/${created.agency}/${created.id}`);
    } catch (err: unknown) {
      setErrors(formatApiErrors(err, appI18n, t("physicalInstance.creation.errorMessage")));
    } finally {
      setIsSubmitting(false);
      onSubmittingChange(false);
    }
  };

  if (isLoadingParents || isLoadingVariables) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-column gap-3">
      <div className="flex flex-column gap-2">
        <label htmlFor="newFromPhysicalInstanceLabel">{t("physicalInstance.creation.label")}</label>
        <InputText
          id="newFromPhysicalInstanceLabel"
          autoComplete="off"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <fieldset className="flex flex-column gap-2">
        <legend>
          {t("physicalInstance.newFrom.variables", {
            selected: selectedIds.length,
            total: variables.length,
          })}
        </legend>
        <div>
          <input
            type="checkbox"
            id="newFromSelectAll"
            checked={allSelected}
            onChange={toggleAll}
            disabled={isSubmitting || variables.length === 0}
          />{" "}
          <label htmlFor="newFromSelectAll">{t("physicalInstance.newFrom.selectAll")}</label>
        </div>
        <ul className="new-from-list">
          {variables.map((variable) => {
            const inputId = `newFromVariable-${variable.id}`;
            return (
              <li key={variable.id}>
                <input
                  type="checkbox"
                  id={inputId}
                  checked={!excluded.has(variable.id)}
                  onChange={() => toggle(variable.id)}
                  disabled={isSubmitting}
                />
                <label htmlFor={inputId}>{`${variable.name} — ${variable.label}`}</label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {/* Sans parents (étude introuvable), le back ne saurait où créer le fichier. */}
      {(errors.length > 0 || parentsError) && (
        <div role="alert" className="p-error">
          {(errors.length > 0
            ? errors
            : formatApiErrors(parentsError, appI18n, t("physicalInstance.creation.errorMessage"))
          ).map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <div className="dialog-footer">
        <Button
          label={t("physicalInstance.newFrom.back")}
          type="button"
          outlined
          onClick={onBack}
          disabled={isSubmitting}
        />
        <Button
          label={t("physicalInstance.newFrom.create")}
          type="submit"
          className="create-button"
          disabled={isSubmitting || !isFormValid}
          loading={isSubmitting}
        />
      </div>
    </form>
  );
};
