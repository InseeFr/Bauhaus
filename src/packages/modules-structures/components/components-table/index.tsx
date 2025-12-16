import { Column } from "primereact/column";

import { DataTable } from "@components/datatable";

import D from "../../i18n/build-dictionary";

export const ComponentsTable = ({ components }: Readonly<{ components: any[] }>) => {
  return (
    <DataTable
      value={components}
      withPagination={false}
      globalFilterFields={["labelLg1", "type", "mutualized", "concept", "representation"]}
    >
      <Column field="labelLg1" header={D.label}></Column>
      <Column field="type" header={D.type}></Column>
      <Column field="mutualized" header={D.mutualized}></Column>
      <Column field="concept" header={D.conceptTitle}></Column>
      <Column field="representation" header={D.representationTitle}></Column>
      <Column field="actions" header="" style={{ display: "flex" }}></Column>
    </DataTable>
  );
};
