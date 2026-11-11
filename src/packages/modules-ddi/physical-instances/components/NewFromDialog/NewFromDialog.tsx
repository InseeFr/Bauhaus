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
import { useGroupDetails } from "../../../hooks/useGroupDetails";
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
import { RolloverVariable, useRollover } from "../../../hooks/useRollover";
import { useStudyUnitVariables } from "../../../hooks/useStudyUnitVariables";
import { formatDate } from "../../../utils/formatDate";
import { pickLang } from "../../../utils/multilingual";
import { buildDataRelationshipLabel, buildLogicalRecordLabel } from "../../constants";
import type { Variable } from "../../types/api";
import { itemsOfType } from "../../types/ddi4Items";
import "./NewFromDialog.css";

const filterLabel = filterKeyDeburr(["label"]);

interface SourceInstance {
  agency: string;
  id: string;
  label: string;
}

type Step = "source" | "workflow" | "reuseVariables" | "rollover";

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
 * Deux parcours : « Nouvelle période » (#1672) et « Réutiliser des variables » (#1674).
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
          onRollover={() => setStep("rollover")}
          onReuseVariables={() => setStep("reuseVariables")}
        />
      )}
      {step === "rollover" && source && (
        <RolloverStep
          source={source}
          onBack={() => setStep("workflow")}
          onSubmittingChange={setIsSubmitting}
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
  onRollover: () => void;
  onReuseVariables: () => void;
}

const WorkflowStep = ({
  source,
  onBack,
  onRollover,
  onReuseVariables,
}: Readonly<WorkflowStepProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-column gap-3">
      <p>{t("physicalInstance.newFrom.selectedSource", { label: source.label })}</p>
      <button type="button" className="new-from-card" onClick={onRollover}>
        <span className="new-from-card-title">{t("physicalInstance.newFrom.rollover.title")}</span>
        <span>{t("physicalInstance.newFrom.rollover.description")}</span>
      </button>
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

/** Valeur du choix « dupliquer » dans le sélecteur d'une variable déjà dérivée. */
const COPY = "__copy__";

const NO_CANDIDATES: Variable[] = [];

/**
 * Variables de l'étude cible indexées par la variable source que pointe leur `BasedOn` direct
 * (l'ascendance n'est pas remontée). Calculé une fois par lecture de l'étude cible.
 */
const indexDerivedBySource = (targetVariables: Variable[]) => {
  const bySource = new Map<string, Variable[]>();
  for (const candidate of targetVariables) {
    const sourceIds = new Set(candidate.BasedOnObject?.BasedOnReference?.map((ref) => ref.ID));
    for (const sourceId of sourceIds) {
      bySource.set(sourceId, [...(bySource.get(sourceId) ?? []), candidate]);
    }
  }
  return bySource;
};

interface RolloverStepProps {
  source: SourceInstance;
  onBack: () => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
}

/**
 * Nouvelle période (#1672) : le nouveau fichier rejoint une autre opération de la série de la
 * source. Les variables cochées (toutes par défaut) sont dupliquées, sauf quand l'opération cible
 * en contient déjà une dérivée : elle est alors proposée à la réutilisation. Plusieurs dérivées
 * de la même variable imposent un choix explicite.
 */
const RolloverStep = ({ source, onBack, onSubmittingChange }: Readonly<RolloverStepProps>) => {
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
  // Lecture lente (ddiset du groupe, ~20 s sur une grosse série) : la liste des opérations
  // reste annoncée en chargement plutôt que vide.
  const {
    data: groupDetails,
    isLoading: isLoadingStudyUnits,
    error: groupError,
  } = useGroupDetails(parents?.group.agency ?? null, parents?.group.id ?? null);
  const rollover = useRollover();
  const [label, setLabel] = useState("");
  const [studyUnitId, setStudyUnitId] = useState("");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  // Choix explicites par variable source : identifiant de la dérivée réutilisée, ou COPY.
  const [choices, setChoices] = useState<Map<string, string>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Les autres opérations de la série : la nouvelle période ne peut pas rejoindre celle de la source.
  const studyUnits = useMemo(
    () =>
      itemsOfType(groupDetails, "StudyUnit").filter(
        (studyUnit) =>
          !(
            studyUnit.ID === parents?.studyUnit.id && studyUnit.Agency === parents?.studyUnit.agency
          ),
      ),
    [groupDetails, parents],
  );
  const studyUnitOptions = useMemo(
    () =>
      studyUnits.map((studyUnit) => ({
        label: pickLang(studyUnit.Citation.Title, "fr-FR") ?? studyUnit.ID,
        value: studyUnit.ID,
      })),
    [studyUnits],
  );
  const target = studyUnits.find((studyUnit) => studyUnit.ID === studyUnitId);
  // Tant qu'elles ne sont pas lues, les variables déjà dérivées ne peuvent pas être proposées.
  // Illisibles, elles ne valent pas une liste vide : tout serait dupliqué, y compris les reprises.
  const {
    data: targetVariables = NO_CANDIDATES,
    isLoading: isLoadingTargetVariables,
    error: targetVariablesError,
  } = useStudyUnitVariables(target?.Agency ?? "", target?.ID ?? "", !!target);
  const derivedBySource = useMemo(() => indexDerivedBySource(targetVariables), [targetVariables]);
  const candidatesOf = (sourceId: string) => derivedBySource.get(sourceId) ?? NO_CANDIDATES;
  const isTargetReady = !!target && !isLoadingTargetVariables && !targetVariablesError;

  const selected = variables.filter((v) => !excluded.has(v.id));
  const allSelected = variables.length > 0 && selected.length === variables.length;

  /** Choix retenu pour une variable : explicite, sinon l'unique dérivée, sinon à faire (""). */
  const choiceOf = (sourceId: string): string => {
    const candidates = candidatesOf(sourceId);
    if (candidates.length === 0) return COPY;
    const explicit = choices.get(sourceId);
    // Un choix dont la variable a disparu de l'étude cible (relue entre-temps) est périmé.
    if (
      explicit !== undefined &&
      (explicit === COPY || candidates.some((candidate) => candidate.ID === explicit))
    ) {
      return explicit;
    }
    return candidates.length === 1 ? candidates[0].ID : "";
  };

  // Bilan de ce que la création va faire : copies, réutilisations, choix restant à faire.
  const summary = selected.reduce(
    (counts, v) => {
      const choice = choiceOf(v.id);
      if (choice === COPY) counts.copied++;
      else if (choice === "") counts.pending++;
      else counts.reused++;
      return counts;
    },
    { copied: 0, reused: 0, pending: 0 },
  );

  const readError = parentsError ?? groupError ?? (target ? targetVariablesError : null);

  const isFormValid =
    !!label.trim() &&
    !!parents &&
    isTargetReady &&
    selected.length > 0 &&
    selected.every((v) => choiceOf(v.id) !== "");

  const toggle = (id: string) =>
    setExcluded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setExcluded(allSelected ? new Set(variables.map((v) => v.id)) : new Set());

  const choose = (sourceId: string, value: string) =>
    setChoices((current) => new Map(current).set(sourceId, value));

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || !parents || !target) return;

    const rolloverVariables: RolloverVariable[] = selected.map((v) => {
      // choiceOf ne rend que l'ID d'une dérivée présente : à défaut, la variable est copiée.
      const reused = candidatesOf(v.id).find((candidate) => candidate.ID === choiceOf(v.id));
      return reused
        ? { sourceId: v.id, reusedAgency: reused.Agency, reusedId: reused.ID }
        : { sourceId: v.id };
    });

    setIsSubmitting(true);
    onSubmittingChange(true);
    setErrors([]);
    try {
      const created = await rollover.mutateAsync({
        agencyId: source.agency,
        id: source.id,
        data: {
          physicalInstanceLabel: label,
          dataRelationshipLabel: buildDataRelationshipLabel(label),
          logicalRecordLabel: buildLogicalRecordLabel(label),
          studyUnitId: target.ID,
          studyUnitAgency: target.Agency,
          groupId: parents.group.id,
          groupAgency: parents.group.agency,
          variables: rolloverVariables,
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

      <div className="flex flex-column gap-2">
        <label htmlFor="newFromStudyUnit">{t("physicalInstance.creation.studyUnit")}</label>
        <Select
          inputId="newFromStudyUnit"
          placeholder={t("physicalInstance.creation.selectStudyUnit")}
          value={studyUnitId || null}
          options={studyUnitOptions}
          loading={isLoadingStudyUnits}
          disabled={isSubmitting || isLoadingStudyUnits}
          onChange={(value: string | null) => {
            setStudyUnitId(value ?? "");
            // Les dérivées proposées dépendent de l'opération cible.
            setChoices(new Map());
          }}
        />
      </div>

      <fieldset className="flex flex-column gap-2">
        <legend>
          {t("physicalInstance.newFrom.variables", {
            selected: selected.length,
            total: variables.length,
          })}
        </legend>
        {target && isLoadingTargetVariables && (
          <p className="new-from-parents" aria-live="polite">
            {t("physicalInstance.newFrom.rollover.loadingTarget")}
          </p>
        )}
        {isTargetReady && (
          <p className="new-from-summary" aria-live="polite">
            {t("physicalInstance.newFrom.rollover.summary", summary)}
          </p>
        )}
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
            const candidates = candidatesOf(variable.id);
            const choice = choiceOf(variable.id);
            const radioName = `newFromChoice-${variable.id}`;
            return (
              <li key={variable.id} className="new-from-variable">
                <div className="new-from-variable-head">
                  <input
                    type="checkbox"
                    id={inputId}
                    checked={!excluded.has(variable.id)}
                    onChange={() => toggle(variable.id)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={inputId}>{`${variable.name} — ${variable.label}`}</label>
                </div>
                {candidates.length > 0 && !excluded.has(variable.id) && (
                  <fieldset
                    className={
                      choice === "" ? "new-from-choice new-from-choice-pending" : "new-from-choice"
                    }
                    aria-label={t("physicalInstance.newFrom.rollover.choice", {
                      name: variable.name,
                    })}
                  >
                    <p className="new-from-choice-hint">
                      {candidates.length > 1
                        ? t("physicalInstance.newFrom.rollover.ambiguous")
                        : t("physicalInstance.newFrom.rollover.alreadyRolledOver")}
                    </p>
                    {candidates.map((candidate) => {
                      const optionId = `${radioName}-${candidate.ID}`;
                      return (
                        <div key={candidate.ID} className="new-from-choice-option">
                          <input
                            type="radio"
                            id={optionId}
                            name={radioName}
                            value={candidate.ID}
                            checked={choice === candidate.ID}
                            onChange={() => choose(variable.id, candidate.ID)}
                            disabled={isSubmitting}
                          />
                          <label htmlFor={optionId}>
                            {t("physicalInstance.newFrom.rollover.reuse", {
                              name: pickLang(candidate.VariableName, "fr-FR") ?? candidate.ID,
                            })}
                            <span className="new-from-choice-detail">
                              {pickLang(candidate.Label, "fr-FR")
                                ? ` — ${pickLang(candidate.Label, "fr-FR")}`
                                : ""}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                    <div className="new-from-choice-option">
                      <input
                        type="radio"
                        id={`${radioName}-copy`}
                        name={radioName}
                        value={COPY}
                        checked={choice === COPY}
                        onChange={() => choose(variable.id, COPY)}
                        disabled={isSubmitting}
                      />
                      <label htmlFor={`${radioName}-copy`}>
                        {t("physicalInstance.newFrom.rollover.copy")}
                      </label>
                    </div>
                  </fieldset>
                )}
              </li>
            );
          })}
        </ul>
      </fieldset>

      {/* Erreur de la création, sinon de la lecture qui empêche de la préparer. */}
      {(errors.length > 0 || readError) && (
        <div role="alert" className="p-error">
          {(errors.length > 0
            ? errors
            : formatApiErrors(readError, appI18n, t("physicalInstance.creation.errorMessage"))
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
