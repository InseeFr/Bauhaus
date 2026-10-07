import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { AdvancedSearchLayout } from "@components/advanced-search-layout";
import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";
import { DataTable } from "@components/ui/data-table";
import { SearchField, SearchTextField } from "@components/ui/search-field";
import { Column } from "@components/ui/table-column";

import { Option } from "@model/SelectOption";

import { filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import {
  PhysicalInstanceSearchRow,
  usePhysicalInstancesSearch,
} from "../../../hooks/usePhysicalInstancesSearch";

const filterLabel = filterKeyDeburr(["label"]);

const defaultFormState = {
  label: "",
  studyUnit: "",
  group: "",
};

/**
 * Options distinctes (par id) d'une clé id/libellé des lignes de recherche, triées par libellé.
 * Les lignes sans id (PI orphelines) sont ignorées.
 */
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

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("physicalInstance.searchTitle"));

  const { data = [], isLoading } = usePhysicalInstancesSearch();
  const { form, setForm, reset, handleChange } = useUrlQueryParameters(defaultFormState);
  const { label, studyUnit, group } = form;

  const groupOptions = useMemo(() => buildOptions(data, "groupId", "groupLabel"), [data]);
  // Les études proposées sont uniquement celles du groupe sélectionné ; sans groupe, le champ
  // reste vide (et désactivé côté rendu).
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

  // Changer de groupe réinitialise l'étude : l'ancienne sélection n'appartient plus au nouveau groupe.
  const onGroupChange = (value: string | null) => setForm({ group: value ?? "", studyUnit: "" });

  const hits: PhysicalInstanceSearchRow[] = useMemo(
    () =>
      data
        .filter(filterLabel(label))
        .filter((row) => !studyUnit || row.studyUnitId === studyUnit)
        .filter((row) => !group || row.groupId === group),
    [data, label, studyUnit, group],
  );

  if (isLoading) return <Loading />;

  const labelBody = (row: PhysicalInstanceSearchRow) => (
    <Link to={`/ddi/physical-instances/${row.agency}/${row.id}`}>{row.label}</Link>
  );

  return (
    <AdvancedSearchLayout
      title={t("physicalInstance.search.title")}
      backTo="/ddi/physical-instances"
      backLabel={t("physicalInstance.search.backToList")}
      onReset={reset}
      results={hits}
      criteria={
        <AdvancedSearchCard>
          <SearchTextField
            col="col-12 md:col-4"
            label={t("physicalInstance.search.labelFilter")}
            value={label}
            onChange={(value) => handleChange("label", value)}
            placeholder={t("physicalInstance.search.labelPlaceholder")}
          />
          <SearchField col="col-12 md:col-4" label={t("physicalInstance.search.groupFilter")}>
            {(id) => (
              <Select
                inputId={id}
                placeholder={t("physicalInstance.search.groupPlaceholder")}
                value={group || null}
                options={groupOptions}
                onChange={onGroupChange}
              />
            )}
          </SearchField>
          <SearchField col="col-12 md:col-4" label={t("physicalInstance.search.studyUnitFilter")}>
            {(id) => (
              <Select
                inputId={id}
                placeholder={t("physicalInstance.search.studyUnitPlaceholder")}
                value={studyUnit || null}
                options={studyUnitOptions}
                disabled={!group}
                onChange={(value: string | null) => handleChange("studyUnit", value ?? "")}
              />
            )}
          </SearchField>
        </AdvancedSearchCard>
      }
    >
      <DataTable value={hits} stripedRows paginator rows={20} dataKey="id">
        <Column
          field="label"
          header={t("physicalInstance.search.columns.label")}
          body={labelBody}
          sortable
        />
        <Column field="groupLabel" header={t("physicalInstance.search.columns.group")} sortable />
        <Column
          field="studyUnitLabel"
          header={t("physicalInstance.search.columns.studyUnit")}
          sortable
        />
      </DataTable>
    </AdvancedSearchLayout>
  );
};
