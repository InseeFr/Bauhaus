import { useTranslation } from "react-i18next";

import { DataTable } from "@components/datatable";
import { Column } from "@components/ui/table-column";

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
