import { useTranslation } from "react-i18next";
import { Column } from "primereact/column";

import { DataTable } from "@components/datatable";

export const ComponentsTable = ({ components }: Readonly<{ components: any[] }>) => {
  const { t } = useTranslation();

  return (
    <DataTable
      value={components}
      withPagination={false}
      globalFilterFields={["labelLg1", "type", "mutualized", "concept", "representation"]}
    >
      <Column field="labelLg1" header={t("component.label")}></Column>
      <Column field="type" header={t("component.type.title")}></Column>
      <Column field="mutualized" header={t("component.mutualized")}></Column>
      <Column field="concept" header={t("component.concept")}></Column>
      <Column field="representation" header={t("component.representation.title")}></Column>
      <Column field="actions" header="" style={{ display: "flex" }}></Column>
    </DataTable>
  );
};
