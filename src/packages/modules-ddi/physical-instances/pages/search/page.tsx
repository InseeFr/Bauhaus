import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { Loading } from "@components/loading";
import { NumberResults } from "@components/number-results";
import { PageTitle } from "@components/page-title";
import { Select } from "@components/select-rmes";
import { SearchField, SearchTextField } from "@components/ui/search-field";

import { filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { Option } from "@model/SelectOption";
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
  useTitle(t("physicalInstance.search.title"));
  const navigate = useNavigate();

  const { data = [], isLoading } = usePhysicalInstancesSearch();
  const { form, setForm, handleChange } = useUrlQueryParameters(defaultFormState);
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
    <div className="container">
      <PageTitle title={t("physicalInstance.search.title")} />
      <div className="mb-3">
        <Button
          icon="pi pi-arrow-left"
          text
          label={t("physicalInstance.search.backToList")}
          onClick={() => navigate("/ddi/physical-instances")}
        />
      </div>
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

      <div className="text-center mb-2">
        <NumberResults results={hits} />
      </div>

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
    </div>
  );
};
