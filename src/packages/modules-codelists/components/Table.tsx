import { Column } from "primereact/column";
import { DataTableStateEvent } from "primereact/datatable";
import { useTranslation } from "react-i18next";

import { DataTable } from "@components/datatable";

import { Code } from "@model/CodesList";

export interface TableTypes {
  loading: boolean;
  codesWithActions: Omit<Code, "broader" | "narrower" | "closeMatch"> &
    {
      broader: string;
      narrower: string;
      closeMatch: string;
      actions: JSX.Element;
    }[];
  total: number;
  state: {
    first: number;
    rows: number;
  };
  onPage: (event: DataTableStateEvent) => void;
}

export const Table = ({
  codesWithActions,
  loading,
  state,
  total,
  onPage,
}: Readonly<TableTypes>) => {
  const { t } = useTranslation();

  return (
    <DataTable
      loading={loading}
      lazy
      first={state.first}
      rows={state.rows}
      withPagination={total > 10}
      rowsPerPageOptions={[10]}
      totalRecords={total}
      value={codesWithActions}
      onPage={onPage}
    >
      <Column field="code" header={t("codes.title")}></Column>

      <Column field="labelLg1" header={t("codes.label", { lng: "fr" })}></Column>

      <Column field="labelLg2" header={t("codes.label", { lng: "en" })}></Column>

      <Column field="broader" header={t("codes.broader")}></Column>

      <Column field="narrower" header={t("codes.narrower")}></Column>

      <Column field="closeMatch" header={t("codes.closeMatch")}></Column>

      <Column field="actions" header=""></Column>
    </DataTable>
  );
};
